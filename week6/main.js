const defaultControls = ol.control.defaults;  //取用defaults控制器群套件
const ZoomSlider = ol.control.ZoomSlider;  //取用ZoomSlider放大縮小軸控制器套件
const Style = ol.style.Style;  //取用style套件Style類別
const CircleStyle = ol.style.Circle;  //取用style套件Circle類別
const Fill = ol.style.Fill;  //取用style套件Fill類別
const Stroke = ol.style.Stroke;  //取用style套件Stroke類別
const Draw = ol.interaction.Draw; //取用繪圖套件

//建立OSM地圖為raster圖層的來源
const rasterSource = new ol.source.OSM();
//建立raster圖層
const raster = new ol.layer.Tile({
  source: rasterSource,
});
const toLonLat = ol.proj.toLonLat;  //取用toLonLat坐標套件
//建立vectorSource為vector圖層的來源
const vectorSource = new ol.source.Vector();

//建立vectorStyle為vector圖層的樣式設定
const vectorStyle = new Style({
  fill: new Fill({  //多邊形的填色
    color: 'rgba(255, 255, 255, 0.3)',    //rgba(red,green,blue,alpha)
  }),
  stroke: new Stroke({  //代表線段的樣式
    color: '#ffcc33',
    width: 2,
  }),
  image: new CircleStyle({  //點位的圓
    radius: 7,  //半徑
    fill: new Fill({  //圓的填色
      color: '#ffcc33',
    }),
  }),
})
const Geolocation = ol.Geolocation;  //取用位置服務套件
//建立Vector圖層
const vector = new ol.layer.Vector({
  source: vectorSource,
  style: vectorStyle,
});
//建立 放大縮小軸 控制器
const zoomSliderControl = new ZoomSlider();

//建立地圖View(視角)
const view = new ol.View({
  center: ol.proj.fromLonLat([120.6499, 24.1808]),
  zoom: 16
});
//建立地圖
var map = new ol.Map({
  controls: defaultControls().extend([zoomSliderControl]),
  target: 'map',
  layers: [raster],
  view: view,
  layers: [raster, vector],
});

//建立地圖
//宣告一個draw變數給繪圖用
let draw;

//取得下拉選單物件
const typeSelect = document.getElementById('VectorType');
//建立drawingStyle為繪圖操作時的樣式設定 (採半透明色)
const drawingStyle = new Style({
  fill: new Fill({  //多邊形的填色
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({  //代表線段的樣式
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({  //點位的圓
    radius: 5,  //半徑
    stroke: new Stroke({  //圓的線段
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({  //圓的填色
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
})
//建立addInteraction()函式，加入到地圖交互作用功能(手動繪圖操作)
function addInteraction() {
  draw = new Draw({
    source: vectorSource,
    type: 'LineString',
    type: 'Polygon',
    type: typeSelect.value,
    style: vectorStyle,
    style: drawingStyle,
  });
  map.addInteraction(draw);
}
//當改變圖形選擇後
function typeSelectChanged() {
  map.removeInteraction(draw);  //先移除draw
  addInteraction();  //呼叫addInteraction()函式來重建draw
};

//清除向量圖徵
function clearVectorFeature() {
  vectorSource.clear();
}
//呼叫addInteraction()函式
addInteraction();
var map = new ol.Map({
  controls: defaultControls().extend([zoomSliderControl]),
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    })
  ],
  view: view,
});

























//改變工具提示文字內容
$('.ol-zoom-in').prop('title', '點擊後，使地圖放大一個層級。');
$('.ol-zoom-out').prop('title', '點擊後，使地圖縮小一個層級。');

//客制化工具提示外觀
$('.ol-zoom-in, .ol-zoom-out').tooltip({
  placement: 'right',
  container: '#map',
});

//在所有任何地方配置中，啟用工具提示
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

//建立圖徵
const positionFeature = new ol.Feature();
//並設定圖徵樣式
positionFeature.setStyle(
  new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,  //半徑 6 pixels
      fill: new ol.style.Fill({
        color: '#3399CC',  //填滿顏色
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2, //外邊框 6 pixels
      }),
    }),
  })
);

//建立圖形-加入一個點位
positionFeature.setGeometry(new ol.geom.Point(coordTCCG));

//在目前的圖台上，建立向量圖層，並指定放入的圖徵
new ol.layer.Vector({
  map: map,
  source: new ol.source.Vector({
    features: [positionFeature],
  }),
});

//建立 geolocation
const geolocation = new Geolocation({
  // enableHighAccuracy must be set to true 才能取到坐標值
  trackingOptions: {
    enableHighAccuracy: true,  //啟用高精度
  },
  projection: view.getProjection(),
});

//紀錄我的位置坐標
var MyPositionCoordinates;

//針對 geolocation 的 change:position 事件處理動作
geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition();
  MyPositionCoordinates = coordinates;  //放到紀錄我的位置坐標變數 MyPositionCoordinates
  let MyCoordinates = document.getElementById('MyCoordinates');  //取得 MyCoordinates 物件
  MyCoordinates.innerHTML = ol.coordinate.toStringXY(toLonLat(coordinates), 4);  //顯示在頁面上
});

//設定開始追蹤我的位置
function GetMyPosition() {
  geolocation.setTracking(true);  //設定追蹤打開
}

//平移到我的位置
function GetPanToMyPosition() {
  if (MyPositionCoordinates != null) {
    positionFeature.setGeometry(new ol.geom.Point(MyPositionCoordinates));  //設定圖徵圖位
    view.setCenter(MyPositionCoordinates);
    view.setZoom(defaultViewOptions.zoom);
  }
}
