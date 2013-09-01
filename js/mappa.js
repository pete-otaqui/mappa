(function() {

    var _polygons = [];
    var _current_polygon;
    var _image = new Image();
    var _tool;

    var TOOL_MOVE = 'move';
    var TOOL_DELETE = 'delete';
    var TOOL_POLYGON = 'polygon';

    function getTool() {
        return _tool;
    }
    function setTool(tool) {
        _tool = tool;
    }

    function getPolygons() {
        return _polygons;
    }
    function getCurrentPolygon() {
        var polygons = getPolygons(),
            current_polygon;
        if (!_current_polygon) {
            _current_polygon = polygons.length;
        }
        if ( !polygons[_current_polygon] ) {
            polygons[_current_polygon] = {
                points: [],
                selected: true
            };
        }
        return polygons[_current_polygon];
    }
    function getPoints() {
        return getCurrentPolygon().points;
    }
    function addPoint(x, y) {
        var polygon = getCurrentPolygon();
        polygon.points.push({x: x, y: y});
        return polygon.points;
    }
    function getImage() {
        return _image;
    }


    function draw(canvas, context, image) {
        clearCanvas(canvas, context);
        drawImage(canvas, context, image);
        drawPolygons(canvas, context);
        drawPoints(canvas, context);
    }

    function clearCanvas(canvas, context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }


    function drawImage(canvas, context, image) {
        context.drawImage(image, 0, 0);
    }
    function drawPoints(canvas, context) {
        points.forEach(function(point, index) {
            drawPointMarker(canvas, context, point);
        });
    }

    function drawPointMarker(canvas, context, point) {
        var s = 3,
            x = point.x - s,
            y = point.y - s,
            w = s * 2,
            h = s * 2;
        context.fillStyle = '#0ff';
        context.fillRect(x, y, w, h);
    }
    function drawPolygons(canvas, context) {
        getPolygons().forEach(function(polygon) {
            var points = polygon.point;
            if ( points.length >= 3 ) {
                context.fillStyle = 'rgba(0, 255, 255, 0.5)';
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                points.forEach(function(point, index) {
                    if ( index > 0 ) {
                        context.lineTo(point.x, point.y);
                    }
                });
                context.closePath();
                context.stroke();
                context.fill();
            }
        });
    }

    function bindEvents(element, canvas, context, image) {
        canvas.addEventListener('click', function(e) {
            console.log(getTool());
            if ( getTool() === TOOL_POLYGON ) {
                addPoint(e.offsetX, e.offsetY);
                draw(canvas, context, image);
            }
        });
        [].forEach.call(element.querySelectorAll('input'), function(input) {
            input.addEventListener('change', function(e) {
                if ( e.target.checked ) {
                    setTool(e.target.value);
                }
            });
        });
    }

    function run(element) {
        var canvas = document.querySelector('.mappa-canvas');
        var context = canvas.getContext('2d');
        var points = getPoints();
        var image = getImage();
        canvas.width = image.width;
        canvas.height = image.height;
        draw(canvas, context, image, points);
        setTool(TOOL_POLYGON);
        bindEvents(element, canvas, context, image);
    }

    function load() {

        var image_url = 'img/increased_risk.png';
        var image = getImage();
        image.onload = function() {
            run(document.querySelector('.mappa'));
        };
        image.src = image_url;
    }
    load();

})();