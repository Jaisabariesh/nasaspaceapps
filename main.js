


const canvas = new fabric.Canvas("myCanvas", { selection: true, backgroundColor: "#000" });
function resizeCanvas() {
  const container = document.getElementById("canvas-container");
  canvas.setWidth(container.clientWidth);
  canvas.setHeight(container.clientHeight);
  canvas.renderAll();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let objectCount = 0;

// ------------------ Delete Icon ------------------
const deleteIcon =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='595.275px' height='595.275px' viewBox='200 215 230 470'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
const deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = "blue";
fabric.Object.prototype.cornerStyle = "circle";

function deleteObject(_eventData, transform) {
  const canvasObj = transform.target.canvas || transform.canvas;
  const target = transform.target || transform;
  if (!canvasObj || !target) return;
  canvasObj.remove(target);
  canvasObj.discardActiveObject();
  canvasObj.renderAll();
  document.getElementById("room-details").innerHTML = "<p>Object deleted.</p>";
}

function renderIcon(ctx, left, top, _styleOverride, fabricObject) {
  const size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(deleteImg, -size / 2, -size / 2, size, size);
  ctx.restore();
}

function addDeleteControl(obj) {
  obj.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: 16,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 24,
  });
  obj.setControlsVisibility({
    mt: false, mb: false, ml: false, mr: false,
    bl: false, br: false, tl: false, tr: false, mtr: true,
  });
}

// ------------------ Generic Object Creator ------------------
function createLabeledObject(type, width, height, name, fillColor) {
  const rect = new fabric.Rect({
    width,
    height,
    fill: fillColor,
    stroke: "white",
    strokeWidth: 2,
    lockScalingX: true,
    lockScalingY: true,
  });
  const text = new fabric.Text(name, {
    fontSize: Math.min(width, height) / 5,
    originX: "center",
    originY: "center",
    fill: type === "energy" ? "black" : "white",
    selectable: false,
  });
  const group = new fabric.Group([rect, text], {
    left: Math.random() * (canvas.width - width),
    top: Math.random() * (canvas.height - height),
    selectable: true,
    evented: true,
  });
  group.objectName = name;
  group.objectID = objectCount++;
  group.type = type;
  addDeleteControl(group);
  canvas.add(group);
  return group;
}

// ------------------ Add Items ------------------
function addRoom() {
  const width = Number(prompt("Enter room width"));
  const height = Number(prompt("Enter room height"));
  if (isNaN(width) || isNaN(height)) return;
  const name = prompt("Enter room name:") || "Room";
  const rect = new fabric.Rect({ width, height, fill: "transparent", stroke: "red", strokeWidth: 3, lockScalingX: true, lockScalingY: true });
  const text = new fabric.Text(name, { fontSize: Math.min(width, height) / 5, originX: "center", originY: "center", fill: "white", selectable: false });
  const group = new fabric.Group([rect, text], { left: Math.random() * (canvas.width - width), top: Math.random() * (canvas.height - height), selectable: true });
  group.objectName = name;
  group.objectID = objectCount++;
  group.type = "room";
  addDeleteControl(group);
  canvas.add(group);
}

function addFurniture() {
  const width = Number(prompt("Enter furniture width"));
  const height = Number(prompt("Enter furniture height"));
  if (isNaN(width) || isNaN(height)) return;
  const name = prompt("Enter furniture name:") || "Furniture";
  createLabeledObject("furniture", width, height, name, "#00FF00");
}

function addEnergy() {
  const width = Number(prompt("Enter energy width"));
  const height = Number(prompt("Enter energy height"));
  if (isNaN(width) || isNaN(height)) return;
  const name = prompt("Enter energy name:") || "Energy";
  const sound = prompt("Enter sound:") || "none";
  const radius = Number(prompt("Enter Radioactive radius")) || 0;
  const energyPerDay = Number(prompt("renewed per day ")) || 0
  const group = createLabeledObject("energy", width, height, name, "#FFD700");
  Object.assign(group, { sound,  radius, energyPerDay,  });
}

function addSurvival() {
  const width = Number(prompt("Enter survival width"));
  const height = Number(prompt("Enter survival height"));
  if (isNaN(width) || isNaN(height)) return;
  const name = prompt("Enter survival name:") || "Survival";
  const proteinPerDay = Number(prompt("Protein/day (g)")) || 0;
  const carbsPerDay = Number(prompt("Carbs/day (g)")) || 0;
  const fatPerDay = Number(prompt("Fat/day (g)")) || 0;
  const energyUsedperDayBysurvival= Number(prompt("Energy consumption in  joules")) || 0;
  const ActiveProtien =  Number(prompt("active protien")) || 0;
  const Activecarb = Number(prompt("Enter active carbs (g)")) || 0;
  const Activefat = Number(prompt("Enter active fat (g)")) || 0;
  const oxygenperday = Number(prompt("oxygen per day in liter")) || 0;
  const Activeoxygen = Number(prompt("oxygen in liter")) || 0;
 const group = createLabeledObject("survival", width, height, name, "#FF4500");
  Object.assign(group, { proteinPerDay, carbsPerDay, fatPerDay, energyUsedperDayBysurvival, ActiveProtien, Activecarb, Activefat,oxygenperday,Activeoxygen});
}

// ------------------ Heater ------------------
function addHeater() {
  const width = Number(prompt("Enter heater width"));
  const height = Number(prompt("Enter heater height"));
  if (isNaN(width) || isNaN(height)) return;
  const name = prompt("Enter heater name:") || "Heater";
  const energyUsedperDayByheater = Number(prompt("Enter energy used per second in joules" )) || 0;
  const heatPerSecond = Number(prompt("Enter heat energy per second")) || 0;
  const group = createLabeledObject("heater", width, height, name, "#FF6347");
  Object.assign(group, { energyUsedperDayByheater, heatPerSecond, });
}
// ------------------ Air Pressure Machine ------------------
function addAirPressureMachine() {
  const width = Number(prompt("Enter machine width"));
  const height = Number(prompt("Enter machine height"));
  if (isNaN(width) || isNaN(height)) return;

  const name = prompt("Enter machine name:") || "Air Pressure Machine";
  const energyUsedperDayByairpressure = Number(prompt("Enter energy used per second in joules")) || 0;
  const WorkdonepressurePerSecond = Number(prompt("Enter WORK DONE PER SECOND JOULE PER SECOND")) || 0;

  const group = createLabeledObject("airPressureMachine", width, height, name, "#1E90FF");

  // Correct variable names here
  Object.assign(group, { energyUsedperDayByairpressure, WorkdonepressurePerSecond });
}


// ------------------ Show Object Details ------------------
canvas.on("selection:created", showDetails);
canvas.on("selection:updated", showDetails);
canvas.on("selection:cleared", () => {
  document.getElementById("room-details").innerHTML = "<p>Select an object on the canvas.</p>";

});
// ------------------ Add Electronics Button Handler ------------------
document.getElementById("addElectronics").addEventListener("click", () => {
const width = Number(prompt("Enter electronics width"));
const height = Number(prompt("Enter electronics height"));
if (isNaN(width) || isNaN(height)) return;


const name = prompt("Enter electronics name:") || "Electronics";
const energyPerSecond = Number(prompt("Enter energy consumption (Joules/sec)")) || 0;


const rect = new fabric.Rect({ width, height, fill: "#8A2BE2", stroke: "white", strokeWidth: 2 });
const text = new fabric.Text(name, { fontSize: Math.min(width, height) / 5, originX: "center", originY: "center", fill: "white", selectable: false });


const group = new fabric.Group([rect, text], {
left: Math.random() * (canvas.width - width),
top: Math.random() * (canvas.height - height),
selectable: true
});


group.objectName = name;
group.objectID = objectCount++;
group.type = "electronics";
group.energyPerSecond = energyPerSecond;


addDeleteControl(group);
canvas.add(group);
});

function showDetails(e) {
  const obj = e.target || (e.selected && e.selected[0]);
  if (!obj) return;

  let details = `<p><strong>ID:</strong> ${obj.objectID}</p>`;

  // Map of editable props by type
  const editableProps = {
    generic: ["name", "width", "height", "x", "y"],
    energy: ["sound", "energyPerDay", "radioactive", "radius", "singleTimeUse"],
    survival: ["proteinPerDay", "carbsPerDay", "fatPerDay", "energyUsed", 
               "ActiveProtien", "Activecarb", "Activefat", "oxygenperday", "Activeoxygen"],
    heater: ["energyUsed", "heatPerSecond", "sound"],
    airPressureMachine: ["energyUsed", "pressurePerSecond"]
  };

  const typeProps = editableProps[obj.type] || [];
  const allProps = [...editableProps.generic, ...typeProps];

  // Show only allowed props in details
  allProps.forEach(prop => {
    if (obj[prop] !== undefined) {
      details += `<p><strong>${prop}:</strong> ${obj[prop]}</p>`;
    }
  });

  // Create edit buttons for each allowed property
  let buttons = allProps.map(prop => {
    const label = prop.replace(/([A-Z])/g, ' $1'); // Add space before capital letters
    return `<button onclick="updateProp(${obj.objectID},'${prop}')">Edit ${label}</button>`;
  }).join(" ");

  document.getElementById("room-details").innerHTML = details + buttons;
}


// ------------------ Update Property ------------------
function updateProp(id, prop) {
  const obj = canvas.getObjects().find((o) => o.objectID === id);
  if (!obj) return;
  if (["radioactive", "singleTimeUse"].includes(prop)) {
    obj[prop] = !obj[prop];
    alert(`${prop} set to ${obj[prop]}`);
  } else {
    const current = obj[prop] || "";
    const newValue = prompt(`Enter new value for ${prop}:`, current);
    if (newValue === null) return;
    if (["width","height","x","y","energyPerDay","proteinPerDay","carbsPerDay","fatPerDay","radius","energyConsumption","energyUsed","heatPerSecond"].includes(prop)) {
      obj[prop] = parseFloat(newValue);
      if (prop === "width") obj._objects[0].set("width", parseFloat(newValue));
      if (prop === "height") obj._objects[0].set("height", parseFloat(newValue));
      if (prop === "x") obj.set("left", parseFloat(newValue));
      if (prop === "y") obj.set("top", parseFloat(newValue));
    } else if (prop === "name") {
      obj.objectName = newValue;
      obj.item(1).text = newValue;
    } else obj[prop] = newValue;
  }
  obj.setCoords();
  canvas.renderAll();
  showDetails({ target: obj });
}

// ------------------ Export / Import ------------------
function exportData() {
  const data = canvas.getObjects().map((obj) => ({
    id: obj.objectID,
    name: obj.objectName,
    type: obj.type,
    x: Math.round(obj.left),
    y: Math.round(obj.top),
    width: Math.round(obj.getScaledWidth()),
    height: Math.round(obj.getScaledHeight()),
    props: {
      sound: obj.sound,
      energyPerDay: obj.energyPerDay,
      radioactive: obj.radioactive,
      radius: obj.radius,
      singleTimeUse: obj.singleTimeUse,
      proteinPerDay: obj.proteinPerDay,
      carbsPerDay: obj.carbsPerDay,
      fatPerDay: obj.fatPerDay,
      energyConsumption: obj.energyConsumption,
      energyUsed: obj.energyUsed,
      heatPerSecond: obj.heatPerSecond
    },
  }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "mars_habitat.json";
  a.click();
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const json = JSON.parse(event.target.result);
    json.forEach((obj) => {
      let group;
      if (obj.type === "room") {
        const rect = new fabric.Rect({ width: obj.width, height: obj.height, fill: "transparent", stroke: "red", strokeWidth: 3, lockScalingX: true, lockScalingY: true });
        const text = new fabric.Text(obj.name, { fontSize: Math.min(obj.width, obj.height) / 5, originX: "center", originY: "center", fill: "white", selectable: false });
        group = new fabric.Group([rect, text], { left: obj.x, top: obj.y, selectable: true });
      } else {
        group = createLabeledObject(obj.type, obj.width, obj.height, obj.name, obj.type === "furniture" ? "#00FF00" : obj.type === "energy" ? "#FFD700" : obj.type === "survival" ? "#FF4500" : "#FF6347");
        group.set({ left: obj.x, top: obj.y });
      }

      // Assign all props properly
      for (const key in obj.props) {
        if (obj.props.hasOwnProperty(key)) group[key] = obj.props[key];
      }

      // Make sure objectID is preserved or updated
      group.objectID = obj.id;
      group.objectName = obj.name;
      addDeleteControl(group);  // important
      canvas.add(group);
    });
    canvas.renderAll();
  };
  reader.readAsText(file);
}


// ------------------ Listeners ------------------
document.getElementById("addRoomBtn").addEventListener("click", addRoom);
document.getElementById("addFurnitureBtn").addEventListener("click", addFurniture);
document.getElementById("addEnergyBtn").addEventListener("click", addEnergy);
document.getElementById("addSurvivalBtn").addEventListener("click", addSurvival);
document.getElementById("addHeaterBtn").addEventListener("click", addHeater);
document.getElementById("exportBtn").addEventListener("click", exportData);
document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", (e) => importData(e.target.files[0]));
const addPressureBtn = document.getElementById("addPreasureBtn");
addPressureBtn.addEventListener("click", addAirPressureMachine);


// ------------------ Incubation Simulation ------------------
function runIncubationSimulation(data) {
  alert('look in the console in your browser for simulation data')
  console.log("🛰️ Starting fixed incubation simulation...");

  const PX_TO_METER = 1 / 50;
  const WALL_HEIGHT = 2.5; // meters
  const TARGET_PRESSURE = 101325; // Pa (1 atm)
  const START_TEMP = -120 + 273.15; // K (Mars)
  const TARGET_TEMP = 25 + 273.15;  // K (Earth room)
  const SECONDS_PER_DAY = 86400;
  const MAX_DAYS = 3;
  const MAX_SECONDS = SECONDS_PER_DAY * MAX_DAYS;

  const AIR_DENSITY = 1.225; // kg/m³
  const SPECIFIC_HEAT_AIR = 1005; // J/kg·K
  const LITER_TO_KG_O2 = 0.001429; // 1 liter O2 ≈ 0.001429 kg

  // ------------------ Room ------------------
  const room = data.find(o => o.type === "room");
  if (!room) {
    console.log("❌ No room defined!");
    return;
  }
  const roomWidth = (room.width || 0) * PX_TO_METER;
  const roomHeight = (room.height || 0) * PX_TO_METER;
  const roomVolume = roomWidth * roomHeight * WALL_HEIGHT;
  const airMass = roomVolume * AIR_DENSITY;

  // ------------------ Objects ------------------
  const heater = data.find(o => o.type === "heater");
  const heatPerSecond = heater ? heater.props.heatPerSecond || 0 : 0;
  const heaterEnergyPerSec = heater ? (heater.props.energyUsedperDayByheater || 0) / SECONDS_PER_DAY : 0;

  const oxyGen = data.find(o => o.type === "survival");
  const oxygenPerSecRenewable = oxyGen ? (oxyGen.props.oxygenperday || 0) * LITER_TO_KG_O2 / SECONDS_PER_DAY : 0; // renewable per second
  let remainingActiveOxygen = oxyGen ? (oxyGen.props.Activeoxygen || 0) * LITER_TO_KG_O2 : 0; // one-time

  const oxyEnergyPerSec = oxyGen ? (oxyGen.props.energyUsedperDayBysurvival || 0) / SECONDS_PER_DAY : 0;

  const pressMachine = data.find(o => o.type === "preasure" || o.type === "airPressureMachine");
  const pressRatePerSec = pressMachine ? pressMachine.props.WorkdonepressurePerSecond || 0 : 0; // Pa/s
  const pressEnergyPerSec = pressMachine ? (pressMachine.props.energyUsedperDayByairpressure || 0) / SECONDS_PER_DAY : 0;

  const batteries = data.filter(o => o.type === "energy");
  const totalEnergy = batteries.reduce((sum, b) => sum + (b.props.energyPerDay || 0), 0);

  if (totalEnergy <= 0) {
    console.log("❌ No energy available! Add batteries or energy objects.");
    return;
  }

  // ------------------ Human oxygen need ------------------
  const humanO2NeedPerSec = 0.0000097; // kg/s

  // ------------------ Simulation Loop ------------------
  let currentTemp = START_TEMP;
  let currentPressure = 0;
  let currentOxygen = 0;
  let totalEnergyUsed = 0;
  let success = false;

  for (let t = 0; t < MAX_SECONDS; t++) {
    // 1. Temperature
    if (heater) {
      const deltaTemp = heatPerSecond / (airMass * SPECIFIC_HEAT_AIR);
      currentTemp += deltaTemp;
      totalEnergyUsed += heaterEnergyPerSec;
    }

    // 2. Oxygen
    let o2ThisSec = oxygenPerSecRenewable;
    if (remainingActiveOxygen > 0) {
      const used = Math.min(remainingActiveOxygen, humanO2NeedPerSec);
      remainingActiveOxygen -= used;
      o2ThisSec += used;
    }
    currentOxygen += o2ThisSec;
    if (oxyGen) totalEnergyUsed += oxyEnergyPerSec;

    // 3. Pressure
    if (pressMachine) {
      currentPressure += pressRatePerSec;
      totalEnergyUsed += pressEnergyPerSec;
    }

    // 4. Energy check
    if (totalEnergyUsed > totalEnergy) {
      console.log("❌ Mission failed: Not enough energy.");
      break;
    }

    // 5. Success check
    if (
      currentTemp >= TARGET_TEMP &&
      currentPressure >= TARGET_PRESSURE &&
      currentOxygen >= humanO2NeedPerSec * MAX_SECONDS
    ) {
      success = true;
      break;
    }
  }

  // ------------------ Results ------------------
  console.log("🚀 Habitat Survival Report:");
  console.log(`Room Volume: ${roomVolume.toFixed(2)} m³`);
  console.log(`Air Mass: ${airMass.toFixed(2)} kg`);
  console.log(`Start Temp: ${(START_TEMP - 273.15).toFixed(2)} °C`);
  console.log(`Final Temp: ${(currentTemp - 273.15).toFixed(2)} °C`);
  console.log(`Target Temp: ${(TARGET_TEMP - 273.15).toFixed(2)} °C`);
  console.log(`Oxygen Required: ${(humanO2NeedPerSec * MAX_SECONDS).toExponential(6)} kg`);
  console.log(`Oxygen Produced: ${currentOxygen.toExponential(6)} kg`);
  console.log(`Pressure: ${currentPressure.toFixed(2)} Pa`);
  console.log(`Target Pressure: ${TARGET_PRESSURE} Pa`);
  console.log(`Total Energy Available: ${totalEnergy.toFixed(2)} J`);
  console.log(`Energy Used: ${totalEnergyUsed.toFixed(2)} J`);

  if (success) {
    console.log("✅ Mission Success!");
  } else {
    console.log("❌ Mission Failed: Insufficient life support or energy.");
  }
}

document.getElementById("ResourcesimulateBtn").addEventListener("click", () => {
  // --- Build the `data` array from your canvas objects ---
  const data = canvas.getObjects().map(obj => ({
    type: obj.type,
    proteinPerDay: obj.proteinPerDay || 0,
    carbsPerDay: obj.carbsPerDay || 0,
    fatPerDay: obj.fatPerDay || 0,
    ActiveProtien: obj.ActiveProtien || 0,
    Activecarb: obj.Activecarb || 0,
    Activefat: obj.Activefat || 0,
    oxygenperday: obj.oxygenperday || 0,
    Activeoxygen: obj.Activeoxygen || 0,
    energyUsedperDayBysurvival: obj.energyUsedperDayBysurvival || 0,
    energyPerDay: obj.energyPerDay || 0
  }));

  const members = Number(prompt("Enter number of members:"));
  if (!members || members <= 0) return alert("Invalid number of members");

  const proteinPerMember = Number(prompt("Protein/day per member (g):"));
  const carbsPerMember = Number(prompt("Carbs/day per member (g):"));
  const fatPerMember = Number(prompt("Fat/day per member (g):"));
  const oxygenPerMember = Number(prompt("Oxygen/day per member (L):"));
  const electricityPerMember = Number(prompt("Electricity/day per member (kWh):"));

  if ([proteinPerMember, carbsPerMember, fatPerMember, oxygenPerMember, electricityPerMember].some(v => isNaN(v) || v < 0))
    return alert("Invalid input");

  const totalReq = {
    protein: proteinPerMember * members,
    carbs: carbsPerMember * members,
    fat: fatPerMember * members,
    oxygen: oxygenPerMember * members,
    electricity: electricityPerMember * members
  };

  const renewable = { protein: 0, carbs: 0, fat: 0, oxygen: 0, electricity: 0 };
  const active = { protein: 0, carbs: 0, fat: 0, oxygen: 0, electricity: 0 };

  data.forEach(obj => {
    if (obj.type === "survival") {
      renewable.protein += obj.proteinPerDay;
      renewable.carbs += obj.carbsPerDay;
      renewable.fat += obj.fatPerDay;
      renewable.oxygen += obj.oxygenperday;
      renewable.electricity += obj.energyUsedperDayBysurvival;

      active.protein += obj.ActiveProtien;
      active.carbs += obj.Activecarb;
      active.fat += obj.Activefat;
      active.oxygen += obj.Activeoxygen;
    }

    if (obj.type === "energy") {
      renewable.electricity += obj.energyPerDay;
    }
  });

  const result = {};
  Object.keys(totalReq).forEach(key => {
    const dailyNeed = totalReq[key];
    const availRenew = renewable[key];
    const availActive = active[key] || 0;

    if (availRenew >= dailyNeed) {
      result[key] = `✅ ${key} OK (renewable sufficient)`;
    } else if (availRenew + availActive >= dailyNeed) {
      result[key] = `⚠️ ${key} renewable insufficient, but active reserve covers 1 day`;
    } else {
      const days = Math.floor((availRenew + availActive) / dailyNeed);
      result[key] = `❌ ${key} insufficient, can survive ${days} day(s)`;
    }
  });
 alert('look in the console in your browser for simulation data')
  console.log("🛰️ Resource Simulation Result:");
  console.table(result);
});



// ------------------ Click Handler ------------------
document.getElementById("simulateBtn").addEventListener("click", () => {
  const data = canvas.getObjects().map(obj => ({
    id: obj.objectID,
    name: obj.objectName,
    type: obj.type,
    x: Math.round(obj.left),
    y: Math.round(obj.top),
    width: Math.round(obj.getScaledWidth()),
    height: Math.round(obj.getScaledHeight()),
    props: {
      sound: obj.sound || "none",
      energyPerDay: obj.energyPerDay || 0,
      radioactive: obj.radioactive || false,
      radius: obj.radius || 0,
      singleTimeUse: obj.singleTimeUse || false,
      proteinPerDay: obj.proteinPerDay || 0,
      carbsPerDay: obj.carbsPerDay || 0,
      fatPerDay: obj.fatPerDay || 0,
      energyUsedperDayBysurvival: obj.energyUsedperDayBysurvival || 0,
      ActiveProtien: obj.ActiveProtien || 0,
      Activecarb: obj.Activecarb || 0,
      Activefat: obj.Activefat || 0,
      oxygenperday: obj.oxygenperday || 0,
      Activeoxygen: obj.Activeoxygen || 0,
      energyUsedperDayByheater: obj.energyUsedperDayByheater || 0,
      heatPerSecond: obj.heatPerSecond || 0,
      energyUsedperDayByairpressure: obj.energyUsedperDayByairpressure || 0,
      WorkdonepressurePerSecond: obj.WorkdonepressurePerSecond || 0,
    }
  }));

  runIncubationSimulation(data);
});
function createHazardZone(obj) {
  if (!obj) return;

  // Remove existing hazard zone if any
  if (obj.hazardZone) {
    canvas.remove(obj.hazardZone);
  }

  const PX_TO_METER = 50; // scaling factor from meters to canvas pixels
  let radiusPX = 0;
  let color = "rgba(255,255,0,0.5)"; // default yellow for minimal hazard

  // --- Sound / Decibel Hazard ---
  if (obj.soundPower !== undefined && obj.decibels !== undefined) {
    const I0 = 1e-12;        // reference sound intensity (W/m²)
    const dBThreshold = 80;  // danger threshold in dB
    const I80 = I0 * Math.pow(10, dBThreshold / 10);
    const radiusMeters = Math.sqrt(obj.soundPower / (4 * Math.PI * I80));
    const dbRadiusPX = radiusMeters * PX_TO_METER;

    if (obj.decibels > dBThreshold) color = "rgba(255,0,0,0.5)";
    radiusPX = Math.max(radiusPX, dbRadiusPX);
  }

  // --- Radioactivity Hazard ---
  if (obj.radius) {
    const radPX = obj.radius * PX_TO_METER;
    radiusPX = Math.max(radiusPX, radPX);
    if (obj.radioactive) color = "rgba(255,0,179,0.5)";
  }

  // Skip if radius is too small
  if (radiusPX < 1) return;

  // --- Get object's absolute position ---
  const bounds = obj.getBoundingRect();

  // --- Draw hazard circle ---
  const hazardZone = new fabric.Circle({
    left: bounds.left + bounds.width / 2,
    top: bounds.top + bounds.height / 2,
    radius: radiusPX,
    fill: color,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    stroke: "red",
    strokeWidth: 1,
  });

  // Attach circle to object for easy removal later
  obj.hazardZone = hazardZone;

  // Add to canvas on top of everything
  canvas.add(hazardZone);
  hazardZone.moveTo(canvas.getObjects().length - 1);

  canvas.renderAll();
}


simulateBtn.addEventListener("click",runIncubtionSimulation);

function createHazardZone(obj) {
  if (!obj) return;

  // Remove existing hazard zone if any
  if (obj.hazardZone) {
    canvas.remove(obj.hazardZone);
  }

  const PX_TO_METER = 50; // scaling factor from meters to canvas pixels
  let radiusPX = 0;
  let color = "rgba(255,255,0,0.5)"; // default yellow for minimal hazard

  // --- Sound / Decibel Hazard ---
  if (obj.soundPower !== undefined && obj.decibels !== undefined) {
    const I0 = 1e-12;        // reference sound intensity (W/m²)
    const dBThreshold = 80;  // danger threshold in dB
    const I80 = I0 * Math.pow(10, dBThreshold / 10);
    const radiusMeters = Math.sqrt(obj.soundPower / (4 * Math.PI * I80));
    const dbRadiusPX = radiusMeters * PX_TO_METER;

    if (obj.decibels > dBThreshold) color = "rgba(255,0,0,0.5)";
    radiusPX = Math.max(radiusPX, dbRadiusPX);
  }

  // --- Radioactivity Hazard ---
  if (obj.radius) {
    const radPX = obj.radius * PX_TO_METER;
    radiusPX = Math.max(radiusPX, radPX);
    if (obj.radioactive) color = "rgba(255,0,179,0.5)";
  }

  // Skip if radius is too small
  if (radiusPX < 1) return;

  // --- Get object's absolute position ---
  const bounds = obj.getBoundingRect();

  // --- Draw hazard circle ---
  const hazardZone = new fabric.Circle({
    left: bounds.left + bounds.width / 2,
    top: bounds.top + bounds.height / 2,
    radius: radiusPX,
    fill: color,
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
    stroke: "red",
    strokeWidth: 1,
  });

  // Attach circle to object for easy removal later
  obj.hazardZone = hazardZone;

  // Add to canvas on top of everything
  canvas.add(hazardZone);
  hazardZone.moveTo(canvas.getObjects().length - 1);

  canvas.renderAll();
}
