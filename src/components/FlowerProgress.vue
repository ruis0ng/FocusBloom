<template>
<div class="flower-progress">
    <button @click="startFocus" v-if="!isTracking">Start Focus</button>
    <button @click="stopFocus" v-if="isTracking">Stop Focus</button>

    <div class="flower-container">
        <img :style="flowerStyle" src="@/assets/flower.png" alt="Focus Flower" class="flower-image" />
    </div>
    <p class="focus-level-message">{{ focusLevelMessage }}</p>
    <p>{{ statusMessage }}</p>
    <p>Active Window: {{ activeTitle }} ({{ activeApp }})</p> 
    <p class="export-log-tip">Please export the log after completing the experiment.</p>
    <button @click="exportLog">Export Log</button>
</div>
</template>

<script>
export default {
    data() {
        return {
            progress: 40,
            statusMessage: "Waiting for focus data...",
            activeTitle: '',
            activeApp: '',
            focusTime: 0,
            nonFocusTime: 0,
            gracePeriodTimer: null,
            lastFocusedWindow: {
                title: '',
                app: '',
                focusedOnWork: false,
            },
            lastTransitionTime: null,
            focusHistory: [],
            isTracking: false,
            updateInterval: null, 
        };
    },
    computed: {
        flowerStyle() {
            const brightness = 0.4 + (this.progress / 100) * 0.6;
            const hue = 40 - (this.progress / 100) * 40;
            const saturation = 30 + (this.progress / 100) * 70;
            const contrast = 70 + (this.progress / 100) * 80;
            const scale = 0.8 + (this.progress / 100) * 0.4;

            return {
                filter: `brightness(${brightness}) hue-rotate(${hue}deg) saturate(${saturation}%) contrast(${contrast}%)`,
                transform: `scale(${scale})`,
                transition: "filter 0.3s ease, transform 0.3s ease",
            };
        },
        focusLevelMessage() {
            if (this.progress >= 70) {
                return "🌸 Your focus is currently at a high level.";
            } else if (this.progress >= 40) {
                return "🌿 Your focus is currently at an average level.";
            } else {
                return "🍂 Your focus is currently at a low level.";
            }
        },
    },
    methods: {
        startFocus() {
            this.isTracking = true;
            this.statusMessage = "Focus tracking started. Please remember to stop it after the experiment.";
            this.lastTransitionTime = Date.now();
            this.lastFocusedWindow = {
                title: '',
                app: '',
                focusedOnWork: false
            };
            window.electron.ipcRenderer.send("start-focus-tracking");
            window.electron.ipcRenderer.on("focus-status", this.handleFocusStatus);
            this.startUpdateLoop(); 
        },
        stopFocus() {
            this.isTracking = false;
            this.statusMessage = "Focus tracking stopped.";
            this.focusTime = 0;
            this.nonFocusTime = 0;
            this.activeTitle = '';
            this.activeApp = '';
            this.progress = 40;
            clearTimeout(this.gracePeriodTimer);
            window.electron.ipcRenderer.send("stop-focus-tracking");
            window.electron.ipcRenderer.removeListener("focus-status", this.handleFocusStatus);
            this.stopUpdateLoop(); 
        },
        exportLog() {
            window.electron.ipcRenderer.send("export-log");
            window.electron.ipcRenderer.once("export-log-success", (_, message) => {
                alert(message);
            });
            window.electron.ipcRenderer.once("export-log-failure", (_, message) => {
                alert(message);
            });
            window.electron.ipcRenderer.once("export-log-cancel", (_, message) => {
                console.log(message);
            });
        },
        handleFocusStatus(_, {
            title,
            appName,
            focusedOnWork
        }) {
            this.activeTitle = title;
            this.activeApp = appName;
            this.updateProgress(focusedOnWork);
        },
        updateProgress(focusedOnWork) {
            const now = Date.now();

            if (this.lastTransitionTime === null) {
                this.lastTransitionTime = now;
                return;
            }

            const timeElapsed = (now - this.lastTransitionTime) / 1000;
            this.lastTransitionTime = now;

            if (
                this.activeTitle !== this.lastFocusedWindow.title ||
                this.activeApp !== this.lastFocusedWindow.app
            ) {
                const transitionType = this.lastFocusedWindow.focusedOnWork ?
                    focusedOnWork ?
                    "work-to-work" :
                    "work-to-nonwork" :
                    focusedOnWork ?
                    "nonwork-to-work" :
                    "nonwork-to-nonwork";

                const record = {
                    from: {
                        title: this.lastFocusedWindow.title,
                        app: this.lastFocusedWindow.app,
                    },
                    to: {
                        title: this.activeTitle,
                        app: this.activeApp,
                    },
                    transitionType,
                    timeSinceLastTransition: Math.round(timeElapsed),
                    timestamp: new Date().toLocaleString(),
                };

                window.electron.ipcRenderer.send("log-transition", record);
                this.focusHistory.push(record);

                this.lastFocusedWindow = {
                    title: this.activeTitle,
                    app: this.activeApp,
                    focusedOnWork,
                };
            }

            if (focusedOnWork) {
                clearTimeout(this.gracePeriodTimer);
                this.gracePeriodTimer = null;
                this.nonFocusTime = 0;
                this.focusTime += timeElapsed;

                if (this.focusTime >= 45) {
                    this.progress = Math.min(this.progress + 1, 100);
                    this.statusMessage = "You are deeply focused. Keep up the great work!";
                } else if (this.focusTime >= 30) {
                    this.statusMessage = "You are focusing. Great job!";
                } else {
                    this.statusMessage = `You are starting to focus... ${this.focusTime.toFixed(1)} seconds`;
                }
            } else {
                if (!this.gracePeriodTimer) {
                    this.gracePeriodTimer = setTimeout(() => {
                        this.focusTime = 0;
                        this.gracePeriodTimer = null;
                    }, 10000);
                }
                this.nonFocusTime += timeElapsed;

                if (this.nonFocusTime >= 30) {
                    this.progress = Math.max(this.progress - 1, 0);
                    this.statusMessage = "You are a bit distracted. Try to refocus.";
                } else {
                    this.statusMessage = `You are briefly distracted... ${this.nonFocusTime.toFixed(1)} seconds`;
                }
            }
        },
        startUpdateLoop() {
            this.updateInterval = setInterval(() => {
                this.updateProgress(this.lastFocusedWindow.focusedOnWork);
            }, 1000); 
        },
        stopUpdateLoop() {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        },
    },
    mounted() {
        window.electron.ipcRenderer.on("focus-status", this.handleFocusStatus);
    },
};
</script>

<style scoped>
.flower-progress {
    text-align: center;
    margin-top: 10px;
}

.flower-container {
    width: 150px;
    height: 150px;
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.flower-image {
    width: 130px;
    transition: filter 0.3s ease, transform 0.3s ease;
}

button {
    margin-top: 10px;
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
}

.focus-level-message {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
}

.export-log-tip {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
    text-align: center;
}
</style>
