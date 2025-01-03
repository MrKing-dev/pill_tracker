document.addEventListener("DOMContentLoaded", () => {
    const daysList = document.getElementById("days-list");
    const days = initializeDays();
  
    function initializeDays() {
      const savedDays = JSON.parse(localStorage.getItem("days"));
      const now = new Date();
      const days = [];
  
      if (savedDays && savedDays.length === 30) {
        for (let i = 0; i < 30; i++) {
          const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
          days.push({
            date: formatDate(date),
            isOn: savedDays[i].date === formatDate(date) ? savedDays[i].isOn : false,
          });
        }
      } else {
        for (let i = 0; i < 30; i++) {
          const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
          days.push({
            date: formatDate(date),
            isOn: false,
          });
        }
      }
  
      saveDays(days);
      return days;
    }
  
    function formatDate(date) {
      return date.toISOString().split("T")[0];
    }
  
    function saveDays(days) {
      localStorage.setItem("days", JSON.stringify(days));
    }
  
    function renderDays() {
      daysList.innerHTML = "";
  
      days.forEach((day, index) => {
        const listItem = document.createElement("li");
        const dateText = document.createElement("span");
        dateText.textContent = day.date;
  
        const switchLabel = document.createElement("label");
        switchLabel.className = "switch";
        const switchInput = document.createElement("input");
        switchInput.type = "checkbox";
        switchInput.checked = day.isOn;
        switchInput.addEventListener("change", () => toggleDay(index));
  
        const slider = document.createElement("span");
        slider.className = "slider";
  
        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(slider);
  
        listItem.appendChild(dateText);
        listItem.appendChild(switchLabel);
        daysList.appendChild(listItem);
      });
    }
  
    function toggleDay(index) {
      days[index].isOn = !days[index].isOn;
      saveDays(days);
      renderDays();
    }
  
    function handleMidnight() {
      days.shift();
      const newDate = new Date();
      days.push({
        date: formatDate(newDate),
        isOn: false,
      });
      saveDays(days);
      renderDays();
      scheduleMidnightTask();
    }
  
    function scheduleMidnightTask() {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeout = nextMidnight - now;
      setTimeout(handleMidnight, timeout);
    }
  
    renderDays();
    scheduleMidnightTask();
  });
  