import dotenv from "dotenv";
import transporter from "./transporter.js";
import generateToken from "./generateToken.js";

dotenv.config();

export const sendMailUpdateLayerForAdmin = async (listUser) => {
  // set the correct mail option
  const mailOptions = {
    from: process.env.EMAIL, // sender address
    to: process.env.CC_MAIL,
    subject: "Update Layer Check",
    html: `<div style="font-size: 18px">
					<h2>DANH SÁCH NGƯỜI DÙNG THAY ĐỔI TẦNG</h2>
          <table>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Tầng cũ</th>
              <th>Tầng mới</th>
              <th>Kết luận</th>
            </tr>
            ${listUser.map(
              (item) =>
                `<tr>
                <td>${item.userId}</td>
                <td>${item.email}</td>
                <td>${item.oldLayer}</td>
                <td>${item.currentLayer}</td>
                <td>
                  ${
                    item.currentLayer > item.oldLayer
                      ? "Tăng"
                      : item.currentLayer < item.oldLayer
                      ? "Giảm"
                      : ""
                  }
                </td>
              </tr>`
            )}
          </table>
				</div>
				
			`,
  };

  const mailSent = await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });

  // send a promise since nodemailer is async
  if (mailSent) return Promise.resolve(1);
};
