const TabGroup = require("electron-tabs");

let tabGroup = new TabGroup({
    newTab: {
        title: 'New Tab',
    }
    },
    console.log("Inside tab")
    );

let tab1 = tabGroup.addTab({
    title: "Electron",
    src: "http://electron.atom.io",
    visible: true,
    arfdae
});
