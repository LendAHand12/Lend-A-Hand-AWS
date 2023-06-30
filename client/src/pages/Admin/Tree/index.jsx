import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tree, TreeNode } from "react-organizational-chart";
import { ToastContainer, toast } from "react-toastify";
import User from "@/api/User";
import "./index.less";

const StyledNode = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-3 rotate-180 text-white text-sm rounded-md inline-block bg-green-600"
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
        <StyledNode onClick={() => onClick(node._id)}>{node.name}</StyledNode>
      }
    >
      {node.children &&
        node.children.length > 0 &&
        node.children.map((ele) => (
          <TreeNodeItem key={ele._id} node={ele} onClick={onClick} />
        ))}
    </TreeNode>
  );
};

const TreePage = ({ match }) => {
  const { id } = match.params;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState("");
  const [treeData, setTreeData] = useState({});

  const handleNodeItemClick = async (id) => {
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
            response.data.children,
            cloneTreeData
          );
          setTreeData(newTreeData);
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
  };

  const handleFindAndPushChild = (id, newChildren, cloneTreeData) => {
    if (cloneTreeData._id === id) {
      return { ...cloneTreeData, children: newChildren };
    } else if (cloneTreeData.children && cloneTreeData.children.length > 0) {
      const updatedChildren = cloneTreeData.children.map((child) =>
        handleFindAndPushChild(id, newChildren, child)
      );
      return { ...cloneTreeData, children: updatedChildren };
    }
    return cloneTreeData;
  };

  // useEffect(() => {
  //   (async () => {
  //     setLoading(true);
  //     await User.getTreeOfUser(id)
  //       .then((response) => {
  //         setLoading(false);
  //         setTreeData(response.data);
  //       })
  //       .catch((error) => {
  //         let message =
  //           error.response && error.response.data.message
  //             ? error.response.data.message
  //             : error.message;
  //         toast.error(message);
  //         setLoading(false);
  //       });
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await User.getChildsOfUserForTree({ id })
        .then((response) => {
          setLoading(false);
          setTreeData(response.data);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast.error(t(message));
          setLoading(false);
        });
    })();
  }, []);

  return (
    <>
      <ToastContainer />
      {loading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : (
        <>
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
          <div className="w-full overflow-auto rotate-180">
            <Tree
              lineWidth={"10px"}
              lineColor={"brown"}
              lineBorderRadius={"10px"}
              label={<StyledNode>{treeData.name}</StyledNode>}
            >
              {treeData.children &&
                treeData.children.length > 0 &&
                treeData.children.map((child) => (
                  <TreeNodeItem
                    key={child._id}
                    node={child}
                    onClick={handleNodeItemClick}
                  />
                ))}
            </Tree>
          </div>
        </>
      )}
    </>
  );
};

export default TreePage;
