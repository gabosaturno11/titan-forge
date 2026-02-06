/**
 * SATURNO FORGE - Framework Loader
 * Loads dial sets from frameworks/*.json
 */
const FrameworkLoader = {
  registry: null,
  current: null,

  async loadRegistry() {
    try {
      const r = await fetch('frameworks/index.json');
      this.registry = await r.json();
      return this.registry;
    } catch (e) {
      console.warn('Framework registry load failed:', e);
      return null;
    }
  },

  async loadFramework(id) {
    const fw = this.registry?.frameworks?.find(f => f.id === id);
    if (!fw || !fw.file) return null;
    try {
      const r = await fetch('frameworks/' + fw.file);
      this.current = await r.json();
      return this.current;
    } catch (e) {
      console.warn('Framework load failed:', e);
      return null;
    }
  },

  getPreset(name) {
    return this.current?.presets?.find(p => p.name === name);
  }
};
