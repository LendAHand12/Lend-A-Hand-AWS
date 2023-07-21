import { useCallback, useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { useSelector } from "react-redux";
import User from "@/api/User";
import { toast, ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";
import { useTranslation } from "react-i18next";
import TreeMenu from "react-simple-tree-menu";
import TreeBG from "@/assets/img/tree.jpg";
import AppleBG from "@/assets/img/apple.png";
import "./index.less";

const colors = [
  "#16a34a",
  "#ea580c",
  "#d97706",
  "#ca8a04",
  "#65a30d",
  "#059669",
  "#0d9488",
  "#0891b2",
  "#0284c7",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#9333ea",
  "#c026d3",
  "#be185d",
  "#e11d48",
];

const StyledNode = ({ children, onClick, layer }) => {
  console.log({ layer });
  if (!layer) {
    layer = 0;
  }
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-3 rotate-180 text-white text-sm rounded-md inline-block`}
      style={{ backgroundColor: colors[layer] }}
    >
      <div className="flex flex-col items-center">
        <span>{children}</span>
        <svg
          className="w-10 h-auto text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.6675 8.40949C15.9295 5.55221 13.2894 7.72919 12.3116 8.91972C11.3167 7.73083 8.14152 5.60094 5.3558 8.45428C1.87366 12.0209 5.85325 19.1543 8.83795 20.6829C10.3303 21.4472 12.3116 20.6543 12.3116 20.1448C12.3116 20.655 13.7783 21.4203 15.245 20.655C18.1785 19.1243 22.0899 11.9811 18.6675 8.40949Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.6675 8.40949C15.9295 5.55221 13.2894 7.72919 12.3116 8.91972C11.3167 7.73083 8.14152 5.60094 5.3558 8.45428C1.87366 12.0209 5.85325 19.1543 8.83795 20.6829C10.3303 21.4472 12.3116 20.6543 12.3116 20.1448C12.3116 20.655 13.7783 21.4203 15.245 20.655C18.1785 19.1243 22.0899 11.9811 18.6675 8.40949Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.7395 5.27826L14.5178 3.50002"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

const TreeNodeItem = ({ node, onClick }) => {
  return (
    <TreeNode
      label={
        <StyledNode
          layer={node.layer}
          onClick={() => onClick(node.key, node.layer)}
        >
          {node.label}
        </StyledNode>
      }
    >
      {node.nodes &&
        node.nodes.length > 0 &&
        node.nodes.map((ele) => (
          <TreeNodeItem key={ele.key} node={ele} onClick={onClick} />
        ))}
    </TreeNode>
  );
};

const TreePage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState({});
  const [treeArr, setTreeArr] = useState([]);
  const [showType, setShowType] = useState(false);
  const [appleWidth, setAppleWidth] = useState(20);
  const [treeDataView, setTreeDataView] = useState([]);
  const [clickedKeys, setClickedKeys] = useState([]);
  const [loadingItem, setLoadingItem] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await User.getChildsOfUserForTree({ id: userInfo.id })
        .then((response) => {
          setLoading(false);
          setClickedKeys([response.data.key]);
          setTreeData({
            ...response.data,
            nodes: response.data.nodes.map((ele) => ({ ...ele, layer: 1 })),
          });
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
          setLoading(false);
        });
      // }
    })();
  }, []);

  const handleNodeItemClick = useCallback(
    async (id, layer) => {
      if (loadingItem) {
        toast.error(t("Getting data.Please wait"));
      } else {
        setLoadingItem(true);
        await User.getChildsOfUserForTree({ id })
          .then((response) => {
            setLoadingItem(false);
            const cloneTreeData = { ...treeData };
            const newTreeData = handleFindAndPushChild(
              id,
              response.data.nodes.map((ele) => ({ ...ele, layer: layer + 1 })),
              cloneTreeData
            );
            setTreeData(newTreeData);
            setClickedKeys(id);
          })
          .catch((error) => {
            let message =
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
            toast.error(t(message));
            setLoadingItem(false);
          });
      }
    },
    [treeData]
  );

  const handleFindAndPushChild = (id, newChildren, cloneTreeData) => {
    if (cloneTreeData.key === id) {
      return { ...cloneTreeData, nodes: newChildren };
    } else if (cloneTreeData.nodes && cloneTreeData.nodes.length > 0) {
      const updatedChildren = cloneTreeData.nodes.map((child) =>
        handleFindAndPushChild(id, newChildren, child)
      );
      return { ...cloneTreeData, nodes: updatedChildren };
    }
    return cloneTreeData;
  };

  useEffect(() => {
    setTreeDataView([treeData]);
  }, [treeData]);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : treeData.key ? (
        <>
          <button
            onClick={() => setShowType(!showType)}
            className="w-full flex justify-center items-center hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          >
            {t("another choose")}
          </button>
          {loadingItem && (
            <div
              className="flex items-center gradient text-white text-sm px-4 py-3 mb-4"
              role="alert"
            >
              <svg
                className="fill-current w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
              </svg>
              <p>{t("Getting data")}...</p>
            </div>
          )}
          {showType ? (
            <div className="w-full overflow-auto rotate-180">
              <Tree
                lineWidth={"10px"}
                lineColor={"brown"}
                lineBorderRadius={"10px"}
                label={<StyledNode>{treeData.label}</StyledNode>}
              >
                {treeData.nodes &&
                  treeData.nodes.length > 0 &&
                  treeData.nodes.map((child) => (
                    <TreeNodeItem
                      key={child.key}
                      node={child}
                      onClick={handleNodeItemClick}
                    />
                  ))}
              </Tree>
            </div>
          ) : (
            // <div className="relative w-full h-full">
            //   <img src={TreeBG} className="w-full h-auto object-contain" />
            //   <div className="absolute top-0 w-full h-2/3">
            //     <div className="relative w-full h-full">
            //       {treeArr &&
            //         treeArr.map((item, index) => {
            //           const { x, y } = getRandomPosition();
            //           console.log({ x, y });
            //           return (
            //             <img
            //               key={index}
            //               src={AppleBG}
            //               style={{
            //                 position: "absolute",
            //                 width: appleWidth,
            //                 top: `${y}px`,
            //                 left: `${x}px`,
            //               }}
            //             />
            //           );
            //         })}
            //     </div>
            //   </div>
            // </div>
            <TreeMenu
              hasSearch={false}
              data={treeDataView}
              onClickItem={(item) => {
                const key = item.key.split("/")[item.key.split("/").length - 1];
                !clickedKeys.includes(key) &&
                  handleNodeItemClick(key, item.layer);
              }}
            ></TreeMenu>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default TreePage;
