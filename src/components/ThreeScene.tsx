'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Planets and Moon
    const celestialBodies = [
      { name: 'Mercury', color: 0xb0b0b0, distance: 2.5, size: 0.3, speed: 0.00047 },
      { name: 'Venus', color: 0xffa500, distance: 4, size: 0.5, speed: 0.00035 },
      { name: 'Earth', color: 0x0000ff, distance: 6, size: 0.6, speed: 0.00030 },
      { name: 'Mars', color: 0xff0000, distance: 8, size: 0.4, speed: 0.00024 },
      { name: 'Jupiter', color: 0xffa07a, distance: 11, size: 1.2, speed: 0.00013 },
      { name: 'Saturn', color: 0xffd700, distance: 14.5, size: 1.0, speed: 0.00009 },
      { name: 'Uranus', color: 0x00ffff, distance: 17, size: 0.8, speed: 0.00007 },
      { name: 'Neptune', color: 0x000080, distance: 20, size: 0.8, speed: 0.00005 },
      { name: 'Pluto', color: 0xd2b48c, distance: 22, size: 0.2, speed: 0.00004 },
    ];

    const planets = celestialBodies.map(data => {
      const geometry = new THREE.SphereGeometry(data.size, 64, 64);
      const material = new THREE.MeshBasicMaterial({ color: data.color });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = data.distance;
      scene.add(planet);

      // Create orbit
      const orbitGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);

      // Create label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        context.font = '48px Arial'; // Increased font size
        context.fillStyle = 'white';
        context.fillText(data.name, 0, 48); // Adjusted y position to match font size
      }
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(4, 2, 1); // Adjust scale as needed
      label.position.set(0, data.size + 0.5, 0); // Position label above the planet
      planet.add(label);

      return { mesh: planet, distance: data.distance, speed: data.speed };
    });

    // Moon
    const moonGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    planets[2].mesh.add(moon); // Adding moon to Earth
    moon.position.x = 1;

    camera.position.set(0, 30, 0);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate planets around the sun
      planets.forEach((planet, index) => {
        const angle = Date.now() * planet.speed;
        planet.mesh.position.x = planet.distance * Math.cos(angle);
        planet.mesh.position.z = planet.distance * Math.sin(angle);
      });

      // Rotate moon around the Earth
      const moonAngle = Date.now() * 0.0036; // 12 times the Earth's speed
      moon.position.x = 1 * Math.cos(moonAngle);
      moon.position.z = 1 * Math.sin(moonAngle);

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeScene;