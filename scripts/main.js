(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var scene = new THREE.Scene(); // Create a Three.js scene object.
		var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Define the perspective camera's attributes.

		var renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(); // Fallback to canvas renderer, if necessary.
		renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the WebGL viewport.
		document.body.appendChild(renderer.domElement); // Append the WebGL viewport to the DOM.
		
		var color = { color: "aqua" };
		var geometry = new THREE.BoxGeometry(20, 20, 20); // Create a 20 by 20 by 20 cube.
		var material = new THREE.MeshBasicMaterial( color ); 
		var cube = new THREE.Mesh(geometry, material); // Create a mesh based on the specified geometry (cube) and material (blue skin).
		scene.add(cube); // Add the cube at (0, 0, 0).

		camera.position.z = 50; // Move the camera away from the origin, down the positive z-axis.
		cube.position.y = 20;
			
		var y = 0
		,anima = null
		,predkoscPoczatkowa = 0.001
		,predkoscRotacji = 0.01
		,animation
		,rotate = true
		,rotateSpeed
		,fall = true
		,fallSpeed;
		
		var podstawowyWybor = document.getElementById('podstawowy')
		,rozszerzonyWybor = document.getElementById('rozszerzony')
		,koloryPodstawowe = document.getElementsByClassName('koloryPodstawowe')[0]
		,koloryRozszerzone = document.getElementsByClassName('koloryRozszerzone')[0]
		,wybranyRozmiar = document.getElementById('wybranyRozmiar')
		,przywrocRozmiar = document.getElementById('przywrocRozmiar');
		
		var reset = function() {
			cube.rotation.x = 0.01; // Rotate the sphere by a small amount about the x- and y-axes.
			cube.rotation.y = 0.01; 
			cube.position.y = 20;
			y = 0;
			render()
		};
	
		var render = function() {
			cube.rotation.x += predkoscRotacji; // Rotate the sphere by a small amount about the x- and y-axes.
			cube.rotation.y += predkoscRotacji; 
			cube.position.y -= y;		
			y += predkoscPoczatkowa;

			if(cube.position.y > -20) {
				renderer.render(scene, camera); // Each time we change the position of the cube object, we must re-render it.
				anima = requestAnimationFrame(render); // Call the render() function up to 60 times per second (i.e., up to 60 animation frames per second).
				animation = true;
			} else {
				cancelAnimationFrame(anima);
				animation = false;
				setTimeout(reset, 3000);
			}
		};
		
		var reModel = function(geometry, material, rotation, positionY) {
			scene.remove(cube);
			cube = new THREE.Mesh(geometry, material);
			scene.add(cube);
			cube.position.y = positionY; 
			cube.rotation.x = rotation;
			cube.rotation.y = rotation;
		};
		
		var hexKonwersja = function(liczba) {
			var wynik = "";
			
			var szesnastki = parseInt(liczba / 16);
			var resztki = parseInt(liczba % 16);
			
			wynik = szesnastki.toString(16) + resztki.toString(16);
			return wynik;
		}

		render();
		
		document.getElementById('reset').addEventListener('click', function(e) {
			cancelAnimationFrame(anima);
			predkoscPoczatkowa = 0.001;
			predkoscRotacji = 0.01;
			reset();
		}, false);

		document.getElementById('resetP').addEventListener('click', function(e) {
			cancelAnimationFrame(anima);
			reset();
		}, false);

		document.getElementById('fasting').addEventListener('click', function(e) {
			predkoscPoczatkowa *= 2;
			predkoscRotacji *= 2;
		}, false);

		document.getElementById('slowing').addEventListener('click', function(e) {
			predkoscPoczatkowa /= 2;
			predkoscRotacji /= 2;
		}, false);

		document.getElementById('stan').addEventListener('click', function(e) {
			var button = document.getElementById('stan');
			if(animation) {
				cancelAnimationFrame(anima);
				animation = false;
				button.innerHTML = 'Wznów Animację';
			} else {
				render();
				animation = true;
				button.innerHTML = 'Zatrzymaj Animację';
			}
		}, false);

		document.getElementById('rotate').addEventListener('click', function(e) {
			var button = document.getElementById('rotate');
			if(rotate) {
				rotateSpeed = predkoscRotacji;
				predkoscRotacji = 0;
				rotate = false;
				button.innerHTML = 'Wznów Rotację';
			} else {
				predkoscRotacji = rotateSpeed;
				rotate = true;
				button.innerHTML = 'Zatrzymaj Rotację';
			}
		}, false);

		document.getElementById('fallen').addEventListener('click', function(e) {
			var button = document.getElementById('fallen');
			if(fall) {
				fallSpeed = y;
				y = 0;
				predkoscPoczatkowa = 0;
				fall = false;
				button.innerHTML = 'Wznów Spadanie';
			} else {
				predkoscPoczatkowa = 0.001;
				y = fallSpeed;
				fall = true;
				button.innerHTML = 'Zatrzymaj Spadanie';
			}
		}, false);
		
		wybranyKolor.addEventListener('change', function(e) {
			var color = {}
			,rotation = cube.rotation.x
			,positionY = cube.position.y;
			
			color.color = this.value.toLowerCase();
			material = new THREE.MeshBasicMaterial( color );
			reModel(geometry, material, rotation, positionY);
			
		}, false);
		
		koloryRozszerzone.addEventListener('input', function(e) {
			var color = {}
			,red = Number(document.getElementById('red').value) || 0
			,green = Number(document.getElementById('green').value) || 0
			,blue = Number(document.getElementById('blue').value) || 0;
			console.log(e.target.type)
			red = ((red > 0) && (red < 256)) ? red : 0;
			green = ((green > 0) && (green < 256)) ? green : 0;
			blue = ((blue > 0) && (blue < 256)) ? blue : 0;
			
			red = hexKonwersja(red);
			green = hexKonwersja(green);
			blue = hexKonwersja(blue);
			
			color.color = "#" + red + green + blue; console.log(red);
			var rotation = cube.rotation.x
			,positionY = cube.position.y;
			
			material = new THREE.MeshBasicMaterial( color );
			reModel(geometry, material, rotation, positionY);
			
		}, false);
		
		podstawowyWybor.addEventListener('click', function(e) {
			koloryRozszerzone.classList.remove('show');
			koloryPodstawowe.classList.toggle('show');
		}, false);
		
		rozszerzonyWybor.addEventListener('click', function(e) {
			koloryPodstawowe.classList.remove('show');
			koloryRozszerzone.classList.toggle('show');
		}, false);
		
		wybranyRozmiar.addEventListener('change', function(e) {
			var rozmiar = parseInt(this.value)
			,rotation = cube.rotation.x
			,positionY = cube.position.y;
			
			geometry = new THREE.CubeGeometry(rozmiar, rozmiar, rozmiar);
			reModel(geometry, material, rotation, positionY);
		}, false);
		
		przywrocRozmiar.addEventListener('click', function(e) {
			var rotation = cube.rotation.x
			,positionY = cube.position.y;
			
			geometry = new THREE.CubeGeometry(20, 20, 20);
			reModel(geometry, material, rotation, positionY);
		}, false);
  });

})();