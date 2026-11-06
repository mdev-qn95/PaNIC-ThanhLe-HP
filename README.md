<div align="center">

<img src="docs/hero.svg" alt="PaNIC Thánh Lễ Hôn Phối — Ảnh và thiệp mời thánh lễ hôn phối" width="100%">

### [✦ Mở PaNIC Thánh Lễ Hôn Phối](https://panic-thanhle-hp.vercel.app)

Studio ảnh cưới chụp rất đẹp, nhưng thánh lễ hôn phối còn cần những điều riêng:<br>
**tên thánh**, **Lời Chúa**, **biểu tượng đức tin** — và một màn hình trang nghiêm trong nhà thờ.<br>
PaNIC Thánh Lễ Hôn Phối giúp gia đình và giáo xứ tự làm bộ ảnh ấy, cùng thiệp mời tham dự thánh lễ, chỉ trong vài phút.

</div>

<br>

## Ba bước là xong

<img src="docs/flow.svg" alt="Nhập tên thánh và họ tên, chọn mẫu ảnh và Lời Chúa, xuất ảnh và thiệp mời" width="100%">

<br>

## 10 mẫu ảnh cho thánh lễ — ảnh là chính


Mỗi mẫu luôn có **tên thánh** và **họ tên** của cả hai người — tên thánh chữ in hoa giãn cách, họ tên chữ viết tay — để cộng đoàn nhận ra ngay.

| Mẫu | Phù hợp |
|---|---|
| ⛪ **Chờ thánh lễ** | Chiếu trước giờ lễ — lời chào cộng đoàn, giờ bắt đầu thật lớn |
| 💍 **Chào mừng** | Ảnh cưới chiếm phần lớn khung hình, tên thánh và họ tên gọn gàng |
| 📖 **Lời Chúa · Giao ước** | Câu Kinh Thánh nổi bật trên ảnh cưới hoặc làm tiêu đề lớn |
| ✝️ **Bí tích Hôn phối · Biểu tượng** | Trang nghiêm như thiệp, có ảnh hoặc chỉ biểu tượng |
| 🕊️ **Khung kính giữa ảnh · Khung viền trắng · Ảnh lớn** | Ảnh toàn khung với thẻ chữ trong mờ hoặc viền mảnh |
| 🙏 **Cảm tạ** | *Tạ ơn Chúa* và lời cảm ơn quý Cha, ca đoàn, cộng đoàn khi kết lễ |


Tự sắp lại bố cục cho **tivi ngang 16:9 & 4K, tivi dọc 9:16, máy chiếu 4:3, bài đăng Facebook 4:5**, poster 60×90, A3 và standee 80×180.

<br>

## Thiệp mời tham dự thánh lễ


Nhập tên cha mẹ hai bên một lần — thiệp mời được dựng sẵn theo đúng lối thiệp Công giáo: **Nhà trai · Nhà gái**, *Trân trọng báo tin lễ thành hôn*, tên thánh và họ tên đôi tân hôn kèm thứ bậc (*Thứ Nam, Út Nữ…*), thánh đường, giờ lễ, **thứ trong tuần tự tính** và ngày âm lịch. Hai kiểu với bố cục, đường nét và font riêng:

- **Trắng hồng hiện đại** — ảnh cưới lớn trên đầu, dải ngày tháng kẻ chỉ, chữ không chân kết hợp chữ bay
- **Viền vàng sang trọng** — ảnh tròn giữa thiệp, khối lịch ngày cỡ lớn, viền kép góc kim cương

Gửi qua Zalo, Messenger hoặc in khổ A5, A6. Tên, gia đình, địa chỉ và ngày lễ điền sẵn chỉ là dữ liệu minh hoạ hư cấu; hãy thay bằng nội dung của gia đình bạn trước khi gửi thiệp.

<br>

## Lời Chúa và biểu tượng đức tin

- **12 câu Kinh Thánh** thường dùng trong thánh lễ hôn phối, trích theo **bản dịch Công giáo của Nhóm Phiên dịch các Giờ Kinh Phụng vụ** — *Mt 19,6 · St 2,24 · St 1,27 · Ga 15,9 · Ga 15,12 · 1 Cr 13 · 1 Ga 4 · Cl 3,14* — hoặc tự nhập câu khác
- **4 biểu tượng**: Nến hoa & đôi tay; Kinh Thánh & cành lá; Nến & chuông cưới; Nến hoa ly & đôi tay.
- **9 bảng màu** trang nhã và 4 bộ font có dấu tiếng Việt chuẩn

<br>

## Làm trên điện thoại

<img src="docs/screens.webp" alt="Giao diện trên điện thoại" width="100%">

| | |
|---|---|
| 📤 **Xuất ảnh** | Từng ảnh hoặc cả bộ — lưu vào Ảnh trên điện thoại, tải file ZIP để chép USB cắm tivi |
| 🖐️ **Chạm · kéo · zoom** | Chạm khung để chọn, kéo để căn ảnh, hai ngón để phóng to; vuốt ngang để đổi mẫu |
| ▶️ **Trình chiếu khi cần** | Chiếu cả bộ toàn màn hình, tự chuyển ảnh, màn hình không tự tắt |
| 🔒 **Riêng tư** | Không cần tài khoản; ảnh cưới được xử lý ngay trên máy, không tải lên đâu cả |

<br>

## Kiểm thử xuất thiệp

Cài Playwright trong môi trường phát triển bằng `npm install --no-save playwright` và `npx playwright install chromium`. Mở máy chủ tĩnh ở cổng 8000, rồi chạy `node tests/invitations.spec.cjs` trong terminal khác. Có thể đổi địa chỉ máy chủ qua `BASE_URL`.

Bài kiểm thử tải thật JPG/PNG của cả 2 mẫu ở khổ điện tử, A5 và A6; kiểm tra hộp tải ảnh, đầy đủ trường thông tin, các biểu tượng và việc giữ nội dung khách tự nhập.

<br>

<div align="center">

**[✦ Bắt đầu tạo ảnh thánh lễ](https://panic-thanhle-hp.vercel.app)**

<sub>Một sản phẩm trong bộ sưu tập <b>PaNIC</b> · làm với ♥ cho các giáo xứ Việt Nam</sub>

</div>


Kiểm tra ảnh tải lên trên Chromium và WebKit (giao diện điện thoại):

```sh
npx playwright install --with-deps chromium webkit
BASE_URL=http://127.0.0.1:8000 node tests/uploaded-photos.spec.cjs
BROWSER=webkit BASE_URL=http://127.0.0.1:8000 node tests/invitations.spec.cjs
```


### Bộ biểu tượng Công giáo bổ sung

Trong Lời Chúa & biểu tượng, bốn lựa chọn duy nhất được dựng lại từ ảnh tham chiếu:

- Nến hoa & đôi tay — Thánh giá trong vòng tròn, nến, hoa, đôi tay và sách.
- Kinh Thánh & cành lá — Kinh Thánh mở, nến, cành lá và hào quang.
- Nến & chuông cưới — Kinh Thánh, đôi nến và chuông cưới.
- Nến hoa ly & đôi tay — Thánh giá, đôi tay, đôi nến và hoa ly.

Ảnh tham chiếu: https://thiepcuoisieure.com/wp-content/uploads/2024/01/HINH-thien-chua-scaled.jpg

Các biểu tượng có nền trong suốt, được tô theo màu của mẫu, hỗ trợ bản trắng trên ảnh tối và xuất PNG/JPG. Nét Bezier được nạp đồng bộ bằng Path2D; không phụ thuộc tải ảnh bên ngoài khi xuất file. Bản SVG độc lập nằm trong `assets/symbols/`; dữ liệu dựng canvas nằm trong `assets/js/symbols.js`. Bộ chọn chỉ giữ bốn biểu tượng này. Biểu tượng đầu tiên là logo đầu trang, favicon và icon màn hình chính.


### Danh mục và thiết lập đã lưu

Chỉ giữ thiệp Trắng hồng hiện đại (`inv_rose`) và Viền vàng sang trọng (`inv_gold`). Mười mẫu ảnh còn lại: Chờ thánh lễ, Chào mừng, Lời Chúa, Khung kính giữa ảnh, Khung viền trắng, Giao ước, Bí tích Hôn phối, Ảnh lớn, Biểu tượng, Cảm tạ.

Khi mở dữ liệu cũ, những slide dùng mẫu đã bỏ được lọc khỏi bộ trình chiếu. Biểu tượng cũ chuyển sang Nến hoa & đôi tay; thiệp đã bỏ chuyển sang Trắng hồng hiện đại. Tên, nội dung, câu Lời Chúa và những slide còn hợp lệ được giữ. Nếu không còn slide hợp lệ, ứng dụng tạo bộ mặc định mới. Kiểm tra: `node tests/catalog-state.cjs`.

Logo sử dụng nét vector của `assets/symbols/covenant_floral.svg`. Các kích thước icon: SVG, favicon PNG 32px, Apple Touch 180px, PWA 192px và 512px.
