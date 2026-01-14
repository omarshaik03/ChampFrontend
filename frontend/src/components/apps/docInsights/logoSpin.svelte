<script>
    import { onMount } from "svelte";
    import wordLogo from './word.png';
    import excelLogo from './excel.png';
    import powerpointLogo from './powerpoint.png';

  
    let logos = [
      wordLogo,
      powerpointLogo,
      excelLogo
    ];
    
    let currentLogo = logos[0];
    let index = 0;
  
    const spinDuration = 2000; 

    function changeLogo() {
      index = (index + 1) % logos.length;
      currentLogo = logos[index];
    }
  
    onMount(() => {
      setInterval(() => {
        changeLogo();
      }, spinDuration);
    });
  </script>
  
  <style>
    .spinner {
      width: 100px; 
      height: 100px;
      perspective: 1000px; 
    }
 
    .logo {
      width: 100%;
      height: 100%;
      animation: spinY 2s linear infinite;
      transform-style: preserve-3d; 
    } 
  
     @keyframes spinY {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    } 
     
    
  </style>

  
  <div class="spinner">
    <img class="logo" src={currentLogo} alt="Logo" />
  </div>
  