window.addEventListener("load", function () {
    "use strict";
    
    setTimeout(function(){
        var w = document.getElementById('video').width, h = document.getElementById('video').height;
        //var w = window.innerWidth, h = window.innerHeight;
        
        window.renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0);
        var view = document.getElementById("canvas");
        view.appendChild(renderer.domElement);
        
        window.camera = new THREE.PerspectiveCamera(45, w / h, 100, 1000);
        camera.position.z = 450;
        window.controls = new THREE.TrackballControls(camera, view);
        
        window.scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0x666666));
        
        window.light1 = new THREE.DirectionalLight(0xffffff);
        light1.position.set(0, 100, 100);
        scene.add(light1);
        
        window.light2 = new THREE.DirectionalLight(0xffffff);
        light2.position.set(0, -100, -100);
        scene.add(light2);
        
        var mat = new THREE.MeshPhongMaterial({
            color: 0x4C4C4C, ambient: 0x4C4C4C, specular: 0x030303, shading: THREE.SmoothShading
        });
        var obj = new THREE.Mesh(new THREE.Geometry(), mat);
        scene.add(obj);
        
        var loop = function loop() {
            requestAnimationFrame(loop);
            //obj.rotation.z += 0.05;
            controls.update();
            renderer.clear();
            renderer.render(scene, camera);
        };
        loop();

        var loader = new THREE.STLLoader();
        window.hat = null;
        loader.load( './sorting-hat-web.stl', function ( geometry ) {
            geometry.computeVertexNormals();
            // geometry.mergeVertices();
            hat = new THREE.Mesh( geometry, mat );
            scene.add( hat );
            // change hat rotation

            hat.rotation.x = -50 * Math.PI / 180;
            hat.rotation.z = 0;
            hat.rotation.y = 0;
            // change scene position
            // scene.position.x = -200;
            // scene.position.y = 200;
        });
        
        // file load
        var openFile = function (file) {
            var reader = new FileReader();
            reader.addEventListener("load", function (ev) {
                var buffer = ev.target.result;
                var geom = loadStl(buffer);
                scene.remove(obj);
                obj = new THREE.Mesh(geom, mat);
                scene.add(obj);
            }, false);
            reader.readAsArrayBuffer(file);
        };
        
        // file input button
        /*var input = document.getElementById("file");
        input.addEventListener("change", function (ev) {
            var file = ev.target.files[0];
            console.log(file);
            openFile(file);
        }, false);*/
        
        // dnd
        view.addEventListener("dragover", function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "copy";
        }, false);
        view.addEventListener("drop", function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var file = ev.dataTransfer.files[0];
            openFile(file);
        }, false);
    }, 1500);
}, false);