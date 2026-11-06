'use strict';
/* ===== Bảng màu (cho slide) ===== */
const PALS={
  ivory:{n:'Ngà vàng kim',bg:'#fbf8f1',text:'#2a2118',accent:'#b08a4a'},
  rose:{n:'Hồng thiệp cưới',bg:'#fdf5f6',text:'#3a1f26',accent:'#b8324a'},
  white:{n:'Trắng tinh khôi',bg:'#ffffff',text:'#1d1b19',accent:'#a88b55'},
  cream:{n:'Kem nâu',bg:'#f7eedb',text:'#3a2a20',accent:'#8a5a3a'},
  marian:{n:'Xanh Đức Mẹ',bg:'#f2f5f9',text:'#1c2e4a',accent:'#4a6fa1'},
  navy:{n:'Đêm sao vàng',bg:'#121a2c',text:'#f4efe3',accent:'#d6b46a'},
  wine:{n:'Đỏ rượu nho',bg:'#faf4f2',text:'#4a1520',accent:'#9c2b3a'},
  sage:{n:'Xanh ô-liu',bg:'#f3f4ec',text:'#28331f',accent:'#6f7c4a'},
  noir:{n:'Đen nhung',bg:'#141312',text:'#f3ece0',accent:'#c9a86a'},
};
const FP={
  classic:{n:'Cổ điển',display:'Cormorant Garamond',dw:500,serif:'Cormorant Garamond',script:'Great Vibes'},
  sign:{n:'Chữ ký thiệp',display:'Noto Serif',dw:400,serif:'Cormorant Garamond',script:'Ephesis'},
  lux:{n:'Sang trọng',display:'Playfair Display',dw:400,serif:'Playfair Display',script:'Dancing Script'},
  modern:{n:'Hiện đại',display:'Montserrat',dw:300,serif:'Lora',script:'Great Vibes'},
};
/* ===== Kích thước ===== */
const SIZES={
  tv169:{n:'Tivi ngang 16:9',sub:'1920 × 1080 · Full HD',w:1920,h:1080,u:'px',g:'Tivi · máy chiếu'},
  tv4k:{n:'Tivi ngang 4K',sub:'3840 × 2160',w:3840,h:2160,u:'px',g:'Tivi · máy chiếu'},
  tv916:{n:'Tivi dọc 9:16',sub:'1080 × 1920',w:1080,h:1920,u:'px',g:'Tivi · máy chiếu'},
  proj43:{n:'Máy chiếu 4:3',sub:'1600 × 1200',w:1600,h:1200,u:'px',g:'Tivi · máy chiếu'},
  fb45:{n:'Đăng Facebook 4:5',sub:'1080 × 1350',w:1080,h:1350,u:'px',g:'Mạng xã hội'},
  g60:{n:'Poster 60×90',sub:'60 × 90 cm · in giá vẽ',w:60,h:90,u:'cm',g:'In ấn'},
  a3:{n:'Poster A3',sub:'29.7 × 42 cm',w:29.7,h:42,u:'cm',g:'In ấn'},
  st80:{n:'Standee 80×180',sub:'80 × 180 cm',w:80,h:180,u:'cm',g:'In ấn'},
};
const ISIZES={
  share:{n:'Gửi Zalo · Messenger',sub:'1414 × 2000 px',w:1414,h:2000,u:'px',g:'Thiệp điện tử'},
  a5:{n:'In thiệp A5',sub:'14.8 × 21 cm',w:14.8,h:21,u:'cm',g:'In thiệp'},
  a6:{n:'In thiệp A6',sub:'10.5 × 14.8 cm',w:10.5,h:14.85,u:'cm',g:'In thiệp'},
};

/* ===== Lời Chúa — trích theo bản dịch Kinh Thánh Công giáo (Nhóm Phiên dịch CGKPV) ===== */
const VERSES=[
  {t:'Sự gì Thiên Chúa đã phối hợp, loài người không được phân ly.',r:'Mt 19,6'},
  {t:'Cả hai thành một xương một thịt.',r:'St 2,24'},
  {t:'Thiên Chúa sáng tạo con người có nam có nữ.',r:'St 1,27'},
  {t:'Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em.',r:'Ga 15,12'},
  {t:'Hãy ở lại trong tình thương của Thầy.',r:'Ga 15,9'},
  {t:'Đức mến thì nhẫn nhục, hiền hậu, không ghen tương, không vênh vang.',r:'1 Cr 13,4'},
  {t:'Đức mến tha thứ tất cả, tin tưởng tất cả, hy vọng tất cả, chịu đựng tất cả.',r:'1 Cr 13,7'},
  {t:'Cao trọng hơn cả là đức mến.',r:'1 Cr 13,13'},
  {t:'Thiên Chúa là tình yêu.',r:'1 Ga 4,8'},
  {t:'Ai ở lại trong tình yêu thì ở lại trong Thiên Chúa.',r:'1 Ga 4,16'},
  {t:'Chúng ta yêu thương, vì Thiên Chúa đã yêu thương chúng ta trước.',r:'1 Ga 4,19'},
  {t:'Trên hết mọi đức tính, anh em phải có lòng bác ái: đó là mối dây liên kết tuyệt hảo.',r:'Cl 3,14'},
];

/* ===== Biểu tượng đức tin ===== */
const SYMBOLS={ref_covenant:'Nến hoa & đôi tay',ref_scripture:'Kinh Thánh & cành lá',ref_bells:'Nến & chuông cưới',ref_lilies:'Nến hoa ly & đôi tay'};
const DEFAULT_SYMBOL='ref_covenant';
const SLIDE_TEMPLATE_IDS=['waiting','welcome','verse','panel','frame','covenant','sacrament','poster','emblem','thanks'];
const INVITE_TEMPLATE_IDS=['inv_rose','inv_gold'];

/* ===== Nội dung minh hoạ hư cấu — không dùng thông tin của gia đình thật ===== */
const TEXTS={
  title:'Thánh Lễ Hôn Phối',
  gs:'Giuse',gn:'Nguyễn Minh Khang',grank:'Trưởng Nam',
  bs:'Maria',bn:'Trần Thảo Vy',brank:'Trưởng Nữ',
  gfs:'Phêrô',gfn:'Nguyễn Văn An',gms:'Anna',gmn:'Lê Ngọc Mai',ga:'Địa chỉ nhà trai - Tỉnh/Thành phố',
  bfs:'Gioan',bfn:'Trần Quốc Bình',bms:'Têrêsa',bmn:'Phạm Hoài Lan',ba:'Địa chỉ nhà gái - Tỉnh/Thành phố',
  date:'20 · 12 · 2026',time:'09:00',lunar:'Nhằm ngày … tháng … năm …',
  parish:'Giáo xứ An Bình',
  welcome:'Kính chào quý Cha, quý Tu sĩ, quý quan khách và cộng đoàn',
  wait:'Thánh lễ sẽ bắt đầu lúc',
  thanks:'Tạ ơn Chúa',
  thanks2:'Chân thành cảm ơn quý Cha, quý Tu sĩ, ca đoàn, quý quan khách và cộng đoàn đã hiệp dâng thánh lễ cùng chúng con.',
  inv1:'Trân trọng báo tin',inv2:'Lễ thành hôn của con chúng tôi',inv3:'Thánh lễ hôn phối được cử hành tại',
};
const FIELDS_SLIDE=[
  ['Đôi tân hôn',[['gs','Tên thánh (người nam)'],['gn','Họ tên đầy đủ'],['bs','Tên thánh (người nữ)'],['bn','Họ tên đầy đủ']]],
  ['Thánh lễ',[['title','Tiêu đề'],['date','Ngày cử hành'],['time','Giờ'],['parish','Giáo xứ']]],
  ['Lời chào & cảm tạ',[['welcome','Lời chào','area'],['wait','Dòng chờ thánh lễ'],['thanks','Tiêu đề cảm tạ'],['thanks2','Lời cảm tạ','area']]],
];
const FIELDS_INV=[
  ['Nhà trai',[['gfs','Tên thánh ông'],['gfn','Họ tên ông'],['gms','Tên thánh bà'],['gmn','Họ tên bà'],['ga','Địa chỉ (phần sau dấu “-” xuống dòng)']]],
  ['Nhà gái',[['bfs','Tên thánh ông'],['bfn','Họ tên ông'],['bms','Tên thánh bà'],['bmn','Họ tên bà'],['ba','Địa chỉ (phần sau dấu “-” xuống dòng)']]],
  ['Chú rể & cô dâu',[['gs','Tên thánh chú rể'],['gn','Họ tên chú rể'],['grank','Thứ bậc (Trưởng Nam, Thứ Nam…)'],['bs','Tên thánh cô dâu'],['bn','Họ tên cô dâu'],['brank','Thứ bậc (Trưởng Nữ, Út Nữ…)']]],
  ['Thánh lễ',[['date','Ngày (thứ tự động tính)'],['time','Giờ'],['lunar','Ngày âm lịch'],['parish','Giáo xứ']]],
  ['Lời báo tin',[['inv1','Dòng 1'],['inv2','Dòng 2'],['inv3','Dòng mời dự lễ']]],
];
