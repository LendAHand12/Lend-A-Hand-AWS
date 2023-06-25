import { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import User from "../../../api/User";
import { toast, ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";
import "./index.less";

const StyledNode = ({ children }) => {
  return (
    <div className="p-3 rotate-180 text-white text-sm rounded-md inline-block bg-green-600">
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

const TreeNodeItem = ({ node }) => {
  return (
    <TreeNode label={<StyledNode>{node.name}</StyledNode>}>
      {node.children &&
        node.children.length > 0 &&
        node.children.map((ele) => <TreeNodeItem key={ele._id} node={ele} />)}
    </TreeNode>
  );
};

const TreePage = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      await User.getTree()
        .then((response) => {
          setLoading(false);
          setTreeData(response.data);
        })
        .catch((error) => {
          let message =
            error.response && error.response.data.error
              ? error.response.data.error
              : error.message;
          toast.error(message);
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
                <TreeNodeItem key={child._id} node={child} />
              ))}
          </Tree>
        </div>
      )}
    </>
  );
};

export default TreePage;
