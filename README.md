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

Mail gửi đổi ví bằng code 2.5tr => Done
Thêm option view hệ thống 1tr => Done
Trang xem user đã bị xoá 1.5tr => done
Tăng 2 tuần xoá sang 3 tuần xoá 500 => Done
Xoá user không thanh toán trong 48h 1tr => Done
Hệ thống tự đếm số con 1.5tr => Done

Xuất excel => 2tr => Done
Nút xoá user chưa KYC 1tr => Done
Ràng buộc không trùng username 1tr => done

- Chuyển alert full con 500 => done
- Lưu thêm số điện thoại 1tr => done
- thêm cột số lượng con trong xuất excel 500 => done
- thêm số trang danh sách 1tr => done
- nhận diện, mới tần màu khác nhau. Hoàn thành la phải trả $22 dk. 1tr => done
- thêm chức năng hệ thống báo tài khoản đầy tầng 1, 2, 3,... 1tr => done
- trên cây hệ thống của user phải có 2 con số. Danh số và đã trả bao nhiêu lần. => done

- ràng buộc dùng 1 ví đăng ký để thanh toán 1tr => done
- thêm chọn mã vùng cho số điện thoại 1tr => done
- gửi link activation app 2tr => done

- mở khoá + điều chỉnh phí phạt 1tr => done

- bắt buộc update thông tin SĐT, CCCD cho đúng 1tr => done
- xoá user => thêm 1tr
- lưu thêm CCCD 1tr => done
- lưu cây theo tier và thay đổi điều kiện tăng tier => 5tr

- User không thanh toán trong 24h done -> xoá 500
- chuyển từ chưa hoàn thành thanh toán thành hoàn thành done -> 500
- Thêm hiển thị màu đỏ trên cây hệ thống khi user : chưa thanh toán, bị phạt, bị lock, xuống cấp => 2tr

- thông báo chi tiết trùng thông tin gì khi đăng ký 1tr -> done
- nâng số lần đóng góp lên 6 thì mới hoàn thành 1tr500 (update lại thành 1) => done
- trên hệ thống hiển thị đỏ user khi chưa đóng góp trên 6 lần (update lại thành 1) 500 -> done
- thêm phương thức thanh toán theo các gói A,B,C -> 4tr
- A va B full tầng 4 hoặc doanh số 300 Tk, chia ra 3 nhanh . Nhanh cao nhất là 40% thấp nhất 20%
  C- full tầng 5 hoac hoac doanh 680 Tk, chia ra 3 nhanh . Nhanh cao nhất là 40% thấp nhất 20% -> 3tr
- thêm trang terms 1tr -> done

- Giảm gói B xuống 6 lần 500 -> done
- Tăng số lần thanh toán theo đóng góp LAH (tránh bị xoá trong ngày) 500 -> done
- Thêm option thanh toán C hoặc B trong lần đóng góp 7 của gói B -> 1tr done
- Ràng buộc điều kiện thay đổi gói thanh toán của user trên admin -> 1tr done

- Thay đổi thuật toán tìm người gắn id tiếp theo khi qua tier mới -> 2tr

- Gói B thanh toán tiếp tục B chuyển thành A -> 800
- Gói B thanh toán tiếp tục C chuyển thành C -> 800
- Thay đổi mặc định là tiếp tục B -> 1tr

- Thay đổi điều kiện qua tier mới (đã có tài liệu) : 5tr + 1tr
- Bổ sung qui định gói A,B,C (đã có tài liệu) : 2tr
- Nút bật tắt được nhận LAH (đã có tài liệu) -> 750
- Nút bật tắt không được nhận LAH (đã có tài liệu) -> 750
- Chuyển user bất kỳ qua tier mới -> 1tr

0. tại thêm field lý do chưa đủ điều kiện : errLahCode -> done
1. Chuyển countChild thành array : Viết hàm chuyển, sửa model user -> done
2. Viết lại cronJob countChild -> done
3. Viết lại hàm checkCanIncreaseTier : trả đủ 13 lần, đầy tầng 3, tất cả con đều là gói A hoặc B -> done
4. Thêm field ngày lên tier. -> done
5. Làm nút đồng ý chuyển qua tier mới.Lúc này mới tạo cây mới bên tier mới và update ngày lên tier -> done
6. Làm lại phần thanh toán check xem ở tier cũ đã đạt trên 3 tầng và trên 300 tk con chưa hoặc quá 180 ngày mà chưa đủ : nếu chưa đủ sẽ không nhận quá lần 3 LAH -> done
7. check ko đủ 3 con trong vòng 30 ngày hiển thị vàng và mất đi quyền nhận LAH gián tiếp
8. check ko đủ con trong 60 ngày trở lên chuyển sang block
9. Viết lại hàm trả lý do không được nhận LAH khi admin refunds -> done

- Admin update full thông tin User => 1tr
- Admin tạo mới user => 2tr
- Chỉnh data thời gian qua tier mới => 500
- Update điều kiện qua tier 2 chỉ tính gói A, B trong 3 tầng => 700

- Thêm setting Ví admin (Ví nhận phí đăng ký, Ví admin, Ví hold) : 1,5tr
- Thông báo real time khi user đủ điều kiện qua tier mới : 1tr5
- Bổ sung chính sách cho gói A, B : 2tr
  Thời gian 4 ngày sau khi thanh toán

- Admin Up chính sách và User xem chính sách : 4tr

- cms -> 8tr

- user gói C mà thanh toán đủ 13 lần có + 2$ ko
- Gói A đã thanh toán nhưng ko đủ 3 id thì xoá tk mà lỡ có 2 con thì gắn đâu

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
