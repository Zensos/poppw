const script = document.createElement("script");
script.src = "https://unpkg.com/mqtt/dist/mqtt.min.js";
let score = 0;
const img = document.getElementById("toggleImage");
const lol = document.getElementById("trigger");
document.head.appendChild(script);

const topic = "/test/roblox";
let client;

script.onload = () => {
  client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

  client.on("connect", () => {
    client.subscribe(topic, (err) => {
      if (err) {
        console.error(err);
      } else {
        score = 0;
        updateScore();
        client.publish(
          topic,
          JSON.stringify({ type: "increment", from: "web", value: score }),
          (err) => {
            if (err) {
              console.error("Publish error:", err);
            }
          }
        );
      }
    });
  });

  client.on("message", (topic, message) => {
    const value = JSON.parse(message.toString());
    if (value.from === "board") {
      score = value.value;
      updateScore();
      img.src = swappedSrc;
      setTimeout(() => {
        img.src = originalSrc;
      }, 500);
    }
  });

  client.on("error", (err) => {
    console.error(err);
  });
};

function publishMessage() {
  score++;
  updateScore();

  client.publish(
    topic,
    JSON.stringify({ type: "increment", from: "web", value: score }),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = score;
}

const originalSrc = img.src;
const swappedSrc = "https://img2.pic.in.th/pic/ajpanwitsmile.png";

lol.addEventListener("click", () => {
  img.src = swappedSrc;
  publishMessage();
  setTimeout(() => {
    img.src = originalSrc;
  }, 500);
});
