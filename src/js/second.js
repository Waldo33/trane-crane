        import * as THREE from 'three';
        import { OrbitControls } from 'OrbitControls';
        import { GLTFLoader } from 'GLTFLoader';
        import { RectAreaLightHelper } from 'RectAreaLightHelper';
        import { RectAreaLightUniformsLib } from 'RectAreaLightUniformsLib';
        function init() {
            let container = document.querySelector('.model');

            //Scene
            const scene = new THREE.Scene()
            scene.background = new THREE.Color("#E2DFE1");

            //Camera
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
            camera.position.set(50, 70, 160)

            //render
            const renderer = new THREE.WebGLRenderer({antialias: true})
            renderer.setSize(window.innerWidth, window.innerHeight)
            container.appendChild(renderer.domElement)

            let plain;
            {
                plain = new THREE.Mesh(
                    new THREE.PlaneGeometry(1000, 1000),
                    new THREE.MeshBasicMaterial({color: "#E2DFE1"})
                )
                plain.reciveShadow = true;
                plain.position.set(0, -1, 0)
                plain.rotateX(-Math.PI / 2);
                scene.add(plain)
            }

            // Model
            {
                const loader = new GLTFLoader();
                loader.load('./src/assets/3d/rele.gltf', gltf => {
                scene.add(gltf.scene);
                }, 
                    function (error) {
                        console.log('Error: ' + error)
                    }
                )
            }
            
            {

                function setLight (x, y, z, l) {
                    const light = new THREE.DirectionalLight(0xffffff, l)
                    light.position.set(x, y, z)
                    light.lookAt(0, 0, 0)
                    scene.add(light)
                    return light;
                }

                
                setLight(-10, 0, 10, 3);
                setLight(10, 0, -10, 3);
                setLight(0, 10, 0, 3);
                setLight(0, -10, 0, 3);
            }


            RectAreaLightUniformsLib.init();
            {
                const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
                rectLight.position.set(-10,0,0)
                rectLight.rotation.y = Math.PI + Math.PI/4;
                scene.add(rectLight)
            }

            {
                const rectLight = new THREE.RectAreaLight(0xffffff, 1, 100, 100);
                rectLight.position.set(10,0,0)
                rectLight.rotation.y = Math.PI - Math.PI/4;
                scene.add(rectLight)
            }
            
            //OrbitControls
            const controls = new OrbitControls(camera, renderer.domElement);
            // controls.autoRotate = true;
            controls.autoRotateSpeed = 5;
            controls.enableDamping = true;

            //Resize
            window.addEventListener('resize', onWindowResize, false)
            
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight)
            }

            // Animate
            function animate() {
                requestAnimationFrame(animate)
                controls.update();
                renderer.render(scene, camera)
            }
            animate()

        }

        init()