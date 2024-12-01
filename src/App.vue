<template>
    <div id="app">
        <header>
            <h3>Thank you for participating in Rui's experiment :)</h3>
            <nav>                            
                <router-link to="/blankmode">Blank</router-link>       
                <router-link to="/progress-bar">progress</router-link>         
                <router-link to="/flower-progress">Focus Bloom🌸</router-link>          
            </nav>
        </header>      
        <router-view />
    </div>
    </template>
    
    <script>
    
    import router from './router';
    
    export default {
        name: 'App',
        router
    };
    </script>
    
    <style scoped>
    #app {
        text-align: center;
        margin-top: 20px;
        font-family: Avenir, Helvetica, Arial, sans-serif;
    }
    
    header {
        background-color: #42b983;
        padding: 5px;
        color: white;
        font-size: 20px;
        text-align: center;
    }
    
    nav {
        margin-top: 5px;
    }
    
    nav a {
        margin: 0 10px;
        text-decoration: none;
        color: white;
        font-weight: bold;
    }
    
    nav a.router-link-active {
        text-decoration: underline;
    }
    </style>
    