# Dollars Tree

## Features

- [x] Landing Page
- [x] Login with email có gửi verify code
- [x] Sau khi login sẽ bổ sung thông tin user sau (Tên, SĐT, địa chỉ ví)
- [x] Lúc này tài khoản đang ở trạng thái là chưa hợp lệ
- [x] Sau khi chuyển tiền ví (20$ gồm 2$ phí đăng ký + 3$ mua BNB chuyển lại cho ví gửi + 15$ cho cấp trên) sẽ chuyển trạng thái tài khoản là hợp lệ
- [x] kể từ lần chuyển tiền sau một lần sẽ là 15$ gồm 5$ cho cấp trên và 10$ cho cấp trên nữa theo 12 cấp và có thể đóng cho nhiều tuần tối đa là 12 tuần
- [x] hết 12 cấp sẽ qua tier2 và số tiền tăng gấp đôi
- [x] chu kỳ đóng sẽ là 7 ngày kể từ ngày đăng ký
- [x] nếu không đóng sẽ bị phạt 1 tuần là 2$ và cộng dồn
- [x] khi đóng hết phạt tài khoản sẽ được tiếp tục tính level và tier
- [x] 1 tài khoản sẽ có thể giới thiệu ra 3 cấp dưới
- [x] cấu trúc đường link giới thiệu : domain/{user_id_gioi_thieu}/{user_id_duoc_cho_doanh_so}
- [x] trong 1 tuần kể từ khi đăng ký nếu đủ 3 con thì sẽ báo mail về công ty
- [x] trang chờ trả thưởng (hình thức tính thưởng sẽ báo sau) để lên params (ví, số lượng token công ty) để kế toán gửi đi

## Screen

### USER

- [x] homepage : Landing page
- [x] profile : Thông tin user (tên, SĐT, địa chỉ ví)
- [x] transactions : danh sách giao dịch chuyển tiền
- [x] tree : cây hệ thống

### ADMIN

- [x] users : danh sách user
- [x] user/{id} : profile user bao gồm (tên, SĐT, ví, link social nếu có, cây hệ thống, số tiền phạt nếu có)
- [x] transactions : danh sách giao dịch
- [x] bonus : danh sách thưởng đang chờ (để trả token của công ty)

## License

**[MIT](./LICENSE)**

Mail gửi đổi ví bằng code 2.5tr
Thêm option view hệ thống 1tr => Done
Trang xem user đã bị xoá 1.5tr => done
Tăng 2 tuần xoá sang 3 tuần xoá 500 => Done
Xoá user không thanh toán trong 48h 1tr
Hệ thống tự đếm số con 1.5tr => Done
Xuất excel => 2tr => Done
Nút xoá user chưa KYC => 1tr
Ràng buộc không trùng username => 1tr

// update parent
db.users.update({
$and: [
    {isAdmin: false},
    {refId: {$ne: ""}},
{parentId: {$ne: ""}},
]

},
[
{
$set: {
"parentId": {
$toObjectId: "$parentId"
},
"refId": {
$toObjectId: "$refId"
}
}
}
],
{
"multi": true
})

// update wallet
db.users.update({
$and: [
{isAdmin: false}
]

},
[
{
$set: {
"walletAddress": ["$walletAddress"],
}
}
],
{
"multi": true
})
