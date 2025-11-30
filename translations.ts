import { Language } from './types';

interface TranslationData {
  app_title: string;
  version: string;
  big_crunch: string;
  big_crunch_confirm: string;
  cancel: string;
  confirm_reset: string;
  footer_quote: string;
  target_label: string;
  target_name: string;
  click_instruction: string;
  total_matter: string;
  efficiency: string;
  matter_per_sec: string;
  loading: string;
  upgrade_title: string;
  cost: string;
  generators: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
}

export const TRANSLATIONS: Record<Language, TranslationData> = {
  en: {
    app_title: "COSMIC GENESIS",
    version: "Version 1.0.0 // Simulation Active",
    big_crunch: "Big Crunch (Reset)",
    big_crunch_confirm: "Are you sure you want to trigger a Big Crunch? All progress will be lost.",
    cancel: "Cancel",
    confirm_reset: "Confirm Reset",
    footer_quote: "\"In the beginning, there was nothing. Then, you clicked.\"",
    target_label: "Target",
    target_name: "Unstable Singularity",
    click_instruction: "Click to harvest Matter",
    total_matter: "Total Matter",
    efficiency: "running efficiency: 100%",
    matter_per_sec: "matter / sec",
    loading: "Loading universe data...",
    upgrade_title: "Cosmic Fabrication",
    cost: "Cost",
    generators: {
      stardust_collector: {
        name: "Stardust Collector",
        description: "Automated drones that gather trace cosmic dust."
      },
      asteroid_miner: {
        name: "Asteroid Miner",
        description: "Drills extracting heavy metals from space rocks."
      },
      nebula_condenser: {
        name: "Nebula Condenser",
        description: "Compresses gas clouds into tangible matter."
      },
      star_forge: {
        name: "Star Forge",
        description: "A megastructure that births stars to harvest fusion byproducts."
      },
      black_hole_siphon: {
        name: "Black Hole Siphon",
        description: "Extracts matter from the event horizon of singularites."
      },
      galactic_engine: {
        name: "Galactic Engine",
        description: "Moves entire galaxies to collide and harvest the debris."
      }
    }
  },
  zh: {
    app_title: "宇宙创世纪",
    version: "版本 1.0.0 // 模拟运行中",
    big_crunch: "大坍缩 (重置)",
    big_crunch_confirm: "确定要触发大坍缩吗？所有进度将丢失。",
    cancel: "取消",
    confirm_reset: "确认重置",
    footer_quote: "“起初是一片虚无，直到你按下了鼠标。”",
    target_label: "目标",
    target_name: "不稳定的奇点",
    click_instruction: "点击采集物质",
    total_matter: "物质总量",
    efficiency: "运行效率: 100%",
    matter_per_sec: "物质 / 秒",
    loading: "正在加载宇宙数据...",
    upgrade_title: "宇宙构造",
    cost: "花费",
    generators: {
      stardust_collector: {
        name: "星尘收集器",
        description: "自动无人机，负责收集微量的宇宙尘埃。"
      },
      asteroid_miner: {
        name: "小行星矿机",
        description: "从太空岩石中提取重金属的钻探设备。"
      },
      nebula_condenser: {
        name: "星云凝缩器",
        description: "将气体云压缩成有形的物质。"
      },
      star_forge: {
        name: "恒星熔炉",
        description: "通过创造恒星来收集聚变副产物的巨型结构。"
      },
      black_hole_siphon: {
        name: "黑洞汲取器",
        description: "从奇点的事件视界中提取物质。"
      },
      galactic_engine: {
        name: "星系引擎",
        description: "推动整个星系碰撞并收割产生的残骸。"
      }
    }
  }
};