<template>
    <div class="progress-bar">
        <h2>Focus Tracker</h2>
        <button @click="startFocus" v-if="!isTracking">Start Focus</button>
        <button @click="stopFocus" v-if="isTracking">Stop Focus</button>
        <div class="progress-container">
            <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <p>{{ statusMessage }}</p>
        <p>Active Window: {{ activeTitle }} ({{ activeApp }})</p> 
        <p class="focus-level-message">{{ focusLevelMessage }}</p>    
    </div>
    </template>
    
    
        
    <script>
    export default {
        data() {
            return {
                progress: 50,
                statusMessage: "Waiting for focus data...",
                activeTitle: '',
                activeApp: '',
                focusTime: 0,
                nonFocusTime: 0,
                gracePeriodTimer: null, 
                lastFocusedWindow: {
                    title: '',
                    app: '',
                    focusedOnWork: false
                },
                lastTransitionTime: Date.now(),
                focusHistory: [],
                isTracking: false
            };
        },
        computed: {
            focusLevelMessage() {
                if (this.progress >= 70) {
                    return "Your focus is currently at a high level.";
                } else if (this.progress >= 40) {
                    return "Your focus is currently at an average level.";
                } else {
                    return "Your focus is currently at a low level.";
                }
            }
        },
        methods: {
            startFocus() {
                this.isTracking = true;
                this.statusMessage = "Focus tracking started.";
                window.electron.ipcRenderer.send('start-focus-tracking');
                window.electron.ipcRenderer.on('focus-status', this.handleFocusStatus);
            },
            stopFocus() {
                this.isTracking = false;
                this.statusMessage = "Focus tracking stopped.";
                this.focusTime = 0;
                this.nonFocusTime = 0;
                this.activeTitle = '';
                this.activeApp = '';
                this.progress = 50;
                window.electron.ipcRenderer.send('stop-focus-tracking');
                window.electron.ipcRenderer.removeListener('focus-status', this.handleFocusStatus);
            },
            handleFocusStatus(event, {
                title,
                appName,
                focusedOnWork
            }) {
                if (this.isTracking) {
                    this.activeTitle = title;
                    this.activeApp = appName;
                    this.updateProgress(focusedOnWork);
                }
            },
            updateProgress(focusedOnWork) {
                if (!this.isTracking) return;
    
                const now = Date.now();
                const timeElapsed = (now - this.lastTransitionTime) / 1000;
                this.lastTransitionTime = now;   
                
                if (this.activeTitle !== this.lastFocusedWindow.title || this.activeApp !== this.lastFocusedWindow.app) {
                    const transitionType = this.lastFocusedWindow.focusedOnWork ?
                        (focusedOnWork ? "work-related to work-related" : "work-related to non-work-related") :
                        (focusedOnWork ? "non-work-related to work-related" : "non-work-related to non-work-related");
    
                    const record = {
                        from: {
                            title: this.lastFocusedWindow.title,
                            app: this.lastFocusedWindow.app
                        },
                        to: {
                            title: this.activeTitle,
                            app: this.activeApp
                        },
                        transitionType,
                        timeSinceLastTransition: Math.round(timeElapsed),
                        timestamp: new Date().toLocaleString()
                    };
    
                    this.focusHistory.push(record);
                    window.electron.ipcRenderer.send('log-transition', record);
    
                    this.lastFocusedWindow = {
                        title: this.activeTitle,
                        app: this.activeApp,
                        focusedOnWork
                    };
                }   
                
                if (focusedOnWork) {
                    clearTimeout(this.gracePeriodTimer); 
                    this.nonFocusTime = 0;
                    this.focusTime += timeElapsed;
    
                    if (this.focusTime >= 60) {
                        this.progress = Math.min(this.progress + 0.5, 100);
                        this.statusMessage = "Work-Related Activity";
                        this.focusTime = 60;
                    } else {
                        this.statusMessage = `Focusing... ${Math.round(this.focusTime)} seconds`;
                    }
                } else {
                    
                    if (!this.gracePeriodTimer) {
                        this.gracePeriodTimer = setTimeout(() => {
                            this.focusTime = 0; 
                            this.gracePeriodTimer = null; 
                        }, 10000); 
                    }
    
                    this.nonFocusTime += timeElapsed;
    
                    if (this.nonFocusTime >= 45) {
                        this.progress = Math.max(this.progress - 1, 0);
                        this.statusMessage = "Non-Work-Related Activity (Decreasing)";
                    } else {
                        this.statusMessage = `Non-Work-Related Activity (${Math.round(this.nonFocusTime)} seconds)`;
                    }
                }
            }
        },
        mounted() {
            window.electron.ipcRenderer.on('focus-status', this.handleFocusStatus);
        }
    };
    </script>
    
        
    <style scoped>
    .progress-bar {
        text-align: center;
        margin-top: 20px;
    }
    
    .progress-container {
        width: 80%;
        height: 20px;
        background-color: #e0e0e0;
        margin: 20px auto;
        border-radius: 10px;
    }
    
    .progress {
        height: 100%;
        background-color: #4caf50;
        border-radius: 10px;
    }
    
    button {
        margin-top: 10px;
        padding: 8px 16px;
        font-size: 16px;
        cursor: pointer;
    }
    
    .focus-level-message {
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
        color: #333;
    }
    
    </style>
    