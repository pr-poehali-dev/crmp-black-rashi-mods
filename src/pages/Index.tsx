import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const MOD_TYPES = [
  { id: "vehicle", label: "Транспорт", icon: "Car", desc: "Авто, мото, лодки" },
  { id: "weapon", label: "Оружие", icon: "Sword", desc: "Пушки и холодное" },
  { id: "skin", label: "Скин", icon: "User", desc: "Внешность персонажа" },
  { id: "script", label: "Скрипт", icon: "Code", desc: "Игровая механика" },
  { id: "map", label: "Карта", icon: "Map", desc: "Локации и объекты" },
  { id: "sound", label: "Звук", icon: "Volume2", desc: "Музыка и эффекты" },
];

const EXPORT_FORMATS = [
  { id: "lua", label: ".lua", desc: "SAMP/CRMP скрипт" },
  { id: "json", label: ".json", desc: "Данные конфига" },
  { id: "cfg", label: ".cfg", desc: "Конфиг сервера" },
  { id: "asi", label: ".asi", desc: "ASI плагин" },
];

const SAMPLE_OUTPUTS: Record<string, Record<string, string>> = {
  vehicle: {
    lua: `-- Black Russia | Мод транспорта\n-- Сгенерировано AI ModGen v2.1\n\nlocal vehicleId = 411 -- Infernus\nlocal spawnPos = {x = 1234.5, y = -234.1, z = 10.0}\nlocal color1, color2 = 0, 0 -- Чёрный\n\nfunction createVehicle()\n    local veh = createVehicle(vehicleId, spawnPos.x, spawnPos.y, spawnPos.z, 0.0, color1, color2)\n    setVehicleHealth(veh, 1000.0)\n    setVehicleNumberPlate(veh, "BR_MOD")\n    return veh\nend\n\naddEventHandler("onResourceStart", resourceRoot, createVehicle)`,
    json: `{\n  "mod_type": "vehicle",\n  "vehicle_id": 411,\n  "name": "Infernus Custom",\n  "spawn": { "x": 1234.5, "y": -234.1, "z": 10.0 },\n  "colors": [0, 0],\n  "health": 1000,\n  "plate": "BR_MOD",\n  "server": "blackrussia"\n}`,
    cfg: `[Vehicle]\nID=411\nName=Infernus Custom\nSpawnX=1234.5\nSpawnY=-234.1\nSpawnZ=10.0\nColor1=0\nColor2=0\nHealth=1000\nPlate=BR_MOD`,
    asi: `// ASI Plugin: Custom Vehicle\n// Compiled for GTA SA / CRMP\n\n#include "plugin.h"\nusing namespace plugin;\n\nint vehicleModel = 411;\nCVector spawnPos(1234.5f, -234.1f, 10.0f);\n\nvoid SpawnCustomVehicle() {\n    CVehicle* veh = CCarCtrl::CreateCarForScript(\n        vehicleModel, spawnPos, 0\n    );\n}`,
  },
  script: {
    lua: `-- Black Russia | Игровой скрипт\n-- Сгенерировано AI ModGen v2.1\n\nlocal players = {}\n\nfunction onPlayerJoin(player)\n    outputChatBox("[BR-MOD] " .. getPlayerName(player) .. " зашёл!", root, 0, 255, 136)\n    players[player] = { money = 0, level = 1 }\nend\n\nfunction onPlayerQuit(player)\n    players[player] = nil\nend\n\naddEventHandler("onPlayerJoin", root, onPlayerJoin)\naddEventHandler("onPlayerQuit", root, onPlayerQuit)`,
    json: `{\n  "mod_type": "script",\n  "name": "CustomScript",\n  "version": "1.0.0",\n  "events": ["onPlayerJoin", "onPlayerQuit"],\n  "permissions": ["admin", "player"],\n  "server": "blackrussia"\n}`,
    cfg: `[Script]\nName=CustomScript\nVersion=1.0.0\nAutoLoad=true\nDebug=false\nServer=BlackRussia`,
    asi: `// ASI Script Hook\n// Black Russia Compatible\n\n#include "plugin.h"\n\nvoid OnPlayerConnect(int playerId) {\n    // Custom logic here\n}`,
  },
  weapon: {
    lua: `-- Black Russia | Мод оружия\n-- Сгенерировано AI ModGen v2.1\n\nlocal weaponId = 24 -- Desert Eagle\nlocal ammo = 200\n\nfunction giveCustomWeapon(player)\n    givePlayerWeapon(player, weaponId, ammo)\n    setPlayerWeaponSlot(player, 2)\nend\n\naddCommandHandler("weapon", giveCustomWeapon)`,
    json: `{\n  "mod_type": "weapon",\n  "weapon_id": 24,\n  "name": "Desert Eagle Custom",\n  "ammo": 200,\n  "damage": 46.2,\n  "server": "blackrussia"\n}`,
    cfg: `[Weapon]\nID=24\nName=Desert Eagle Custom\nAmmo=200\nDamage=46.2\nAutoGive=false`,
    asi: `// Weapon ASI Mod\nvoid GiveWeapon(int playerId) {\n    // weaponId = 24 (Desert Eagle)\n    // ammo = 200\n}`,
  },
  skin: {
    lua: `-- Black Russia | Скин персонажа\n-- Сгенерировано AI ModGen v2.1\n\nlocal skinId = 292\n\nfunction applySkin(player)\n    setPlayerSkin(player, skinId)\n    spawnPlayer(player)\nend\n\naddEventHandler("onPlayerSpawn", root, function()\n    applySkin(source)\nend)`,
    json: `{\n  "mod_type": "skin",\n  "skin_id": 292,\n  "name": "Custom Skin BR",\n  "gender": "male",\n  "server": "blackrussia"\n}`,
    cfg: `[Skin]\nID=292\nName=Custom Skin BR\nGender=male\nAutoApply=true`,
    asi: `// Skin ASI Mod\nvoid ApplySkin(int playerId) {\n    // skinId = 292\n}`,
  },
  map: {
    lua: `-- Black Russia | Карта/объект\n-- Сгенерировано AI ModGen v2.1\n\nlocal objects = {}\n\nfunction createMapObjects()\n    objects[1] = createObject(1337, 100.0, 200.0, 15.0, 0, 0, 0)\n    objects[2] = createObject(1338, 105.0, 200.0, 15.0, 0, 0, 90)\nend\n\naddEventHandler("onResourceStart", resourceRoot, createMapObjects)`,
    json: `{\n  "mod_type": "map",\n  "name": "Custom Location",\n  "objects": [\n    {"id": 1337, "x": 100.0, "y": 200.0, "z": 15.0}\n  ],\n  "server": "blackrussia"\n}`,
    cfg: `[Map]\nName=Custom Location\nObjectCount=2\nObject1ID=1337\nObject1X=100.0\nObject1Y=200.0`,
    asi: `// Map ASI Mod\nvoid CreateObjects() {\n    // Place custom objects\n}`,
  },
  sound: {
    lua: `-- Black Russia | Звуковой мод\n-- Сгенерировано AI ModGen v2.1\n\nlocal soundFile = "custom_sound.mp3"\nlocal soundPos = {x = 500.0, y = -300.0, z = 10.0}\n\nfunction playCustomSound()\n    playSoundFrontEnd(0, soundFile)\nend\n\naddCommandHandler("playsound", playCustomSound)`,
    json: `{\n  "mod_type": "sound",\n  "file": "custom_sound.mp3",\n  "volume": 0.8,\n  "loop": false,\n  "server": "blackrussia"\n}`,
    cfg: `[Sound]\nFile=custom_sound.mp3\nVolume=0.8\nLoop=false\nAutoPlay=false`,
    asi: `// Sound ASI Mod\nvoid PlayCustomSound() {\n    // Play custom audio file\n}`,
  },
};

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5) + "px",
            height: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5) + "px",
            left: (i * 5.5) % 100 + "%",
            top: "100%",
            background: i % 3 === 0 ? "#00ff88" : i % 3 === 1 ? "#a855f7" : "#38bdf8",
            opacity: 0.4,
            animation: `particle-drift ${12 + (i % 8)}s linear ${(i % 6) * 1.5}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function HeroSection({ onScrollToGen }: { onScrollToGen: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-grid overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,255,136,0.07) 0%, transparent 70%)" }}
      />

      <div
        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
        style={{
          background: "rgba(0,255,136,0.08)",
          border: "1px solid rgba(0,255,136,0.25)",
          color: "#00ff88",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        <span
          className="w-2 h-2 rounded-full inline-block animate-pulse-neon"
          style={{ background: "#00ff88" }}
        />
        СИСТЕМА ОНЛАЙН · BLACK RUSSIA AI v2.1
      </div>

      <div
        className="text-center mb-6"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "all 0.8s ease 0.2s",
        }}
      >
        <h1
          className="font-rajdhani leading-none mb-3"
          style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)", fontWeight: 700, letterSpacing: "-0.02em" }}
        >
          <span className="gradient-text-green glitch-wrapper" data-text="МОД">МОД</span>
          <span style={{ color: "rgba(255,255,255,0.12)" }}> / </span>
          <span className="gradient-text-purple">ГЕНЕРАТОР</span>
        </h1>
        <p
          className="font-rajdhani text-xl md:text-2xl"
          style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.35em", fontWeight: 500 }}
        >
          BLACK RUSSIA · CRMP · GTA SA
        </p>
      </div>

      <p
        className="text-center max-w-xl mb-10 leading-relaxed"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: "1rem",
          opacity: visible ? 1 : 0,
          transition: "all 0.8s ease 0.4s",
        }}
      >
        Нейросеть создаёт готовые моды для КРМП / Black Russia за секунды.<br />
        Описывай — получай код. Экспортируй в нужный формат.
      </p>

      <div
        className="flex flex-col sm:flex-row gap-4 mb-16"
        style={{ opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.6s" }}
      >
        <button
          onClick={onScrollToGen}
          className="btn-neon-solid px-8 py-4 rounded-lg text-base font-rajdhani"
          style={{ fontWeight: 700, fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.1em" }}
        >
          ⚡ СОЗДАТЬ МОД
        </button>
        <button
          onClick={onScrollToGen}
          className="btn-neon px-8 py-4 rounded-lg text-base"
        >
          ПОСМОТРЕТЬ ПРИМЕРЫ
        </button>
      </div>

      <div
        className="grid grid-cols-3 gap-8 md:gap-16"
        style={{ opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.8s" }}
      >
        {[
          { num: "50K+", label: "Модов создано" },
          { num: "4", label: "Формата экспорта" },
          { num: "<3с", label: "Время генерации" },
        ].map((s) => (
          <div key={s.num} className="text-center">
            <div
              className="font-rajdhani gradient-text-green mb-1"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              {s.num}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
        onClick={onScrollToGen}
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 1.2s", background: "none", border: "none" }}
      >
        <Icon name="ChevronDown" size={28} style={{ color: "rgba(0,255,136,0.4)" }} />
      </button>
    </section>
  );
}

function GeneratorSection() {
  const [modType, setModType] = useState("vehicle");
  const [description, setDescription] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["lua"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [activeFormat, setActiveFormat] = useState("lua");
  const [generatedLog, setGeneratedLog] = useState<string[]>([]);

  const toggleFormat = (fmt: string) => {
    setSelectedFormats((prev) => {
      const next = prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt];
      return next.length === 0 ? prev : next;
    });
  };

  const startGeneration = () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setProgress(0);
    setShowResult(false);
    setGeneratedLog([]);

    const logs = [
      "Инициализация нейросети...",
      `Анализ типа: ${MOD_TYPES.find((m) => m.id === modType)?.label}`,
      "Обработка описания...",
      "Генерация структуры кода...",
      "Компиляция модулей...",
      `Экспорт: ${selectedFormats.join(", ")}`,
      "Финальная проверка синтаксиса...",
      "МОД ГОТОВ ✓",
    ];

    let logIdx = 0;
    let prog = 0;

    const interval = setInterval(() => {
      prog += Math.random() * 14 + 4;
      if (prog > 100) prog = 100;
      setProgress(Math.round(prog));

      if (logIdx < logs.length) {
        setGeneratedLog((prev) => [...prev, logs[logIdx]]);
        logIdx++;
      }

      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setShowResult(true);
          setActiveFormat(selectedFormats[0] || "lua");
        }, 400);
      }
    }, 280);
  };

  const getCode = () => {
    const out = SAMPLE_OUTPUTS[modType] || SAMPLE_OUTPUTS.vehicle;
    return out[activeFormat] || out.lua;
  };

  const downloadFile = (fmt: string) => {
    const out = SAMPLE_OUTPUTS[modType] || SAMPLE_OUTPUTS.vehicle;
    const code = out[fmt] || "";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blackrussia_mod.${fmt}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative z-10 px-4 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div
          className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded"
          style={{
            background: "rgba(168,85,247,0.1)",
            border: "1px solid rgba(168,85,247,0.3)",
            color: "#a855f7",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
          }}
        >
          <Icon name="Cpu" size={12} style={{ color: "#a855f7" }} />
          НЕЙРОСЕТЬ АКТИВНА
        </div>
        <h2
          className="font-rajdhani gradient-text-green mb-3"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700 }}
        >
          ГЕНЕРАТОР МОДОВ
        </h2>
        <p style={{ color: "rgba(255,255,255,0.35)" }}>
          Опиши мод на русском — получи готовый код для Black Russia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая панель */}
        <div className="space-y-5">
          {/* Тип мода */}
          <div className="neon-card rounded-xl p-5">
            <h3
              className="font-rajdhani mb-4 flex items-center gap-2"
              style={{ color: "#00ff88", letterSpacing: "0.1em", fontWeight: 600, fontSize: "0.85rem" }}
            >
              <Icon name="Layers" size={16} style={{ color: "#00ff88" }} />
              ТИП МОДА
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOD_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setModType(type.id); setShowResult(false); setGeneratedLog([]); }}
                  className="p-3 rounded-lg text-left transition-all duration-200"
                  style={{
                    background: modType === type.id ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.03)",
                    border: modType === type.id ? "1px solid rgba(0,255,136,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: modType === type.id ? "0 0 15px rgba(0,255,136,0.12)" : "none",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      name={type.icon}
                      size={13}
                      style={{ color: modType === type.id ? "#00ff88" : "rgba(255,255,255,0.35)" }}
                    />
                    <span
                      className="font-rajdhani text-sm"
                      style={{ color: modType === type.id ? "#00ff88" : "rgba(255,255,255,0.65)", fontWeight: 600 }}
                    >
                      {type.label}
                    </span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.72rem" }}>{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Описание */}
          <div className="neon-card rounded-xl p-5">
            <h3
              className="font-rajdhani mb-4 flex items-center gap-2"
              style={{ color: "#00ff88", letterSpacing: "0.1em", fontWeight: 600, fontSize: "0.85rem" }}
            >
              <Icon name="MessageSquare" size={16} style={{ color: "#00ff88" }} />
              ОПИСАНИЕ МОДА
            </h3>
            <textarea
              className="terminal-input w-full rounded-lg p-4 resize-none"
              rows={5}
              placeholder={`Например: "Спортивный Infernus чёрного цвета с турбо и нитро, спавнится у банка"`}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              style={{ fontSize: "0.83rem", lineHeight: 1.65 }}
            />
            <div className="flex justify-between mt-2">
              <span style={{ color: "rgba(255,255,255,0.18)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}>
                {description.length} / 500 символов
              </span>
              <span style={{ color: "rgba(0,255,136,0.35)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}>
                RU · EN
              </span>
            </div>
          </div>

          {/* Форматы */}
          <div className="neon-card rounded-xl p-5">
            <h3
              className="font-rajdhani mb-4 flex items-center gap-2"
              style={{ color: "#00ff88", letterSpacing: "0.1em", fontWeight: 600, fontSize: "0.85rem" }}
            >
              <Icon name="Download" size={16} style={{ color: "#00ff88" }} />
              ФОРМАТЫ ЭКСПОРТА
            </h3>
            <div className="flex flex-wrap gap-2">
              {EXPORT_FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => toggleFormat(fmt.id)}
                  className={`format-tag ${selectedFormats.includes(fmt.id) ? "active" : ""}`}
                >
                  {fmt.label}
                  <span className="ml-1 opacity-50" style={{ fontSize: "0.65rem" }}>{fmt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Кнопка */}
          <button
            onClick={startGeneration}
            disabled={isGenerating || !description.trim()}
            className="w-full py-4 rounded-xl font-rajdhani text-lg tracking-wider transition-all duration-300 flex items-center justify-center gap-3"
            style={{
              fontWeight: 700,
              fontFamily: "Rajdhani, sans-serif",
              letterSpacing: "0.15em",
              background: isGenerating || !description.trim()
                ? "rgba(255,255,255,0.04)"
                : "linear-gradient(135deg, #00ff88, #00bcd4)",
              color: isGenerating || !description.trim() ? "rgba(255,255,255,0.2)" : "#050810",
              boxShadow: isGenerating || !description.trim() ? "none" : "0 0 30px rgba(0,255,136,0.35)",
              cursor: isGenerating || !description.trim() ? "not-allowed" : "pointer",
              border: isGenerating || !description.trim() ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            {isGenerating ? (
              <>
                <Icon name="Loader2" size={20} className="animate-spin" />
                ГЕНЕРАЦИЯ...
              </>
            ) : (
              <>
                <Icon name="Zap" size={20} />
                СГЕНЕРИРОВАТЬ МОД
              </>
            )}
          </button>
        </div>

        {/* Правая панель */}
        <div className="space-y-5">
          {/* Терминал */}
          <div className="neon-card rounded-xl overflow-hidden" style={{ minHeight: "180px" }}>
            <div
              className="px-4 py-3 flex items-center gap-2 border-b"
              style={{ borderColor: "rgba(0,255,136,0.12)", background: "rgba(0,255,136,0.025)" }}
            >
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <span
                className="text-xs ml-2"
                style={{ color: "rgba(0,255,136,0.55)", fontFamily: "'Share Tech Mono', monospace" }}
              >
                br_modgen@ai:~$
              </span>
            </div>
            <div className="p-4 space-y-1" style={{ minHeight: "110px", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.78rem" }}>
              {generatedLog.length === 0 && !isGenerating ? (
                <div style={{ color: "rgba(255,255,255,0.18)" }}>
                  <span style={{ color: "rgba(0,255,136,0.4)" }}>›</span> Ожидание задачи<span className="terminal-cursor" />
                </div>
              ) : (
                generatedLog.map((log, i) => (
                  <div
                    key={i}
                    className="animate-fade-in-up"
                    style={{ color: log.includes("✓") ? "#00ff88" : "rgba(255,255,255,0.55)" }}
                  >
                    <span style={{ color: "rgba(0,255,136,0.5)" }}>›</span> {log}
                  </div>
                ))
              )}
              {isGenerating && (
                <div className="mt-3">
                  <div className="flex justify-between mb-1" style={{ fontSize: "0.7rem" }}>
                    <span style={{ color: "rgba(0,255,136,0.5)" }}>ПРОГРЕСС</span>
                    <span style={{ color: "#00ff88" }}>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%`, transition: "width 0.28s ease" }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Результат */}
          {showResult && (
            <div className="neon-card rounded-xl overflow-hidden animate-fade-in-up">
              <div
                className="px-4 py-3 flex items-center justify-between border-b"
                style={{ borderColor: "rgba(0,255,136,0.12)", background: "rgba(0,255,136,0.025)" }}
              >
                <div className="flex gap-2">
                  {selectedFormats.map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setActiveFormat(fmt)}
                      className={`format-tag ${activeFormat === fmt ? "active" : ""}`}
                    >
                      .{fmt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard?.writeText(getCode())}
                    className="btn-neon px-3 py-1 rounded text-xs flex items-center gap-1"
                    style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 600 }}
                  >
                    <Icon name="Copy" size={11} />
                    КОПИРОВАТЬ
                  </button>
                  <button
                    onClick={() => downloadFile(activeFormat)}
                    className="px-3 py-1 rounded text-xs flex items-center gap-1 font-rajdhani"
                    style={{
                      background: "linear-gradient(135deg, rgba(0,255,136,0.18), rgba(0,188,212,0.18))",
                      border: "1px solid rgba(0,255,136,0.4)",
                      color: "#00ff88",
                      fontWeight: 600,
                      fontFamily: "Rajdhani, sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <Icon name="Download" size={11} />
                    СКАЧАТЬ
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-auto" style={{ maxHeight: "340px" }}>
                <pre
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.78rem",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {getCode()}
                </pre>
              </div>

              <div
                className="px-4 py-3 border-t flex items-center justify-between"
                style={{ borderColor: "rgba(0,255,136,0.08)" }}
              >
                <span style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}>
                  {selectedFormats.length} формат(а) готово
                </span>
                <button
                  className="text-xs flex items-center gap-2 px-4 py-2 rounded font-rajdhani"
                  style={{
                    background: "linear-gradient(135deg, #00ff88, #00bcd4)",
                    color: "#050810",
                    fontWeight: 700,
                    fontFamily: "Rajdhani, sans-serif",
                    letterSpacing: "0.08em",
                  }}
                  onClick={() => selectedFormats.forEach((f) => downloadFile(f))}
                >
                  <Icon name="PackageOpen" size={13} />
                  СКАЧАТЬ ВСЕ
                </button>
              </div>
            </div>
          )}

          {/* Фичи (когда нет результата) */}
          {!showResult && !isGenerating && (
            <div className="space-y-3">
              {[
                { icon: "Zap", title: "Быстрая генерация", desc: "Мод готов менее чем за 3 секунды", color: "#fbbf24" },
                { icon: "Shield", title: "Совместимость", desc: "Проверено на Black Russia 2024", color: "#a855f7" },
                { icon: "RefreshCw", title: "Регенерация", desc: "Улучшай мод неограниченно", color: "#38bdf8" },
              ].map((f) => (
                <div key={f.title} className="neon-card rounded-xl p-4 flex items-start gap-4">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}28` }}
                  >
                    <Icon name={f.icon} size={17} style={{ color: f.color }} />
                  </div>
                  <div>
                    <div
                      className="font-rajdhani mb-1"
                      style={{ color: "rgba(255,255,255,0.82)", fontWeight: 600, fontSize: "0.95rem" }}
                    >
                      {f.title}
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.83rem" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="relative z-10 border-t py-10 px-4 text-center"
      style={{ borderColor: "rgba(0,255,136,0.08)" }}
    >
      <div
        className="font-rajdhani gradient-text-green mb-2"
        style={{ fontSize: "1.2rem", fontWeight: 700 }}
      >
        ◈ КРМП МОД ГЕНЕРАТОР
      </div>
      <p style={{ color: "rgba(255,255,255,0.18)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em" }}>
        BLACK RUSSIA · GTA SA · SAMP · AI POWERED · 2024
      </p>
    </footer>
  );
}

export default function Index() {
  const generatorRef = useRef<HTMLDivElement>(null);

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--dark-bg)" }}>
      <div className="scanline-overlay" />
      <Particles />

      {/* Навбар */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(5,8,16,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,255,136,0.08)",
        }}
      >
        <div
          className="font-rajdhani gradient-text-green"
          style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "0.05em" }}
        >
          ◈ MOD.GEN
        </div>
        <div className="hidden md:flex items-center gap-7">
          {["Генератор", "Форматы", "Примеры"].map((item) => (
            <button
              key={item}
              onClick={scrollToGenerator}
              className="font-rajdhani text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", fontWeight: 500, background: "none", border: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00ff88")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <button onClick={scrollToGenerator} className="btn-neon px-4 py-2 rounded-lg text-sm">
          ЗАПУСТИТЬ
        </button>
      </nav>

      <HeroSection onScrollToGen={scrollToGenerator} />

      <div ref={generatorRef}>
        <GeneratorSection />
      </div>

      <Footer />
    </div>
  );
}