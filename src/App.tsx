/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, 
  Copy, 
  Zap, 
  Globe, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Image as ImageIcon,
  TrendingUp,
  ChevronRight,
  Layout,
  Smartphone,
  Sparkles,
  RefreshCw,
  Sun,
  Moon,
  Languages,
  ArrowRight,
  Download,
  Edit3,
  Layers,
  Type as TypeIcon,
  MousePointer2,
  Trash2,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Stage, Layer, Image as KonvaImage, Text, Transformer } from 'react-konva';
import useImage from 'use-image';

// Types
interface AdVariation {
  alignmentScore: number;
  primaryText: string;
  headline: string;
  description: string;
  cta: string;
  framework: string;
}

interface Targeting {
  advantagePlusMode: string;
  seedInterests: string[];
  exclusions: string[];
  location: string;
}

interface AdResult {
  persona: string;
  targeting: Targeting;
  variations: AdVariation[];
  extraSuggestions: {
    imagePrompts: string[];
    urgencyHooks: string[];
    performancePrediction: string;
  };
  imageEditorSuggestions?: {
    layers: string[];
    fonts: string;
    positioning: string;
  };
}

const TEXT_MODEL = "gemini-3.1-pro-preview";
const IMAGE_MODEL = "gemini-2.5-flash-image";

const LANGUAGES = [
  { id: 'Roman Urdu', label: 'Roman Urdu' },
  { id: 'English', label: 'English' },
  { id: 'Urdu (Arabic script)', label: 'Urdu (Arabic script)' },
  { id: 'Pashto (پښتو)', label: 'Pashto (پښتو)' },
  { id: 'Arabic (العربية)', label: 'Arabic (العربية)' },
  { id: 'Punjabi (ਪੰਜਾਬੀ)', label: 'Punjabi (پنجابی)' },
  { id: 'Mixed Urdu+English', label: 'Mixed Urdu+English' },
];

const AD_COPY_STYLES = [
  { id: 'Standard', label: 'Standard (Balanced)' },
  { id: 'Emoji-Rich', label: 'Emoji-Rich (Engaging)' },
  { id: 'Bullet Points', label: 'Bullet Points (Clear)' },
  { id: 'Minimalist', label: 'Minimalist (Elite)' },
  { id: 'Bold Hooks', label: 'Bold Hooks (Scroll-Stopper)' },
];

// Editor Component
const EliteImageEditor = ({ imageUrl, suggestions, onClose }: { imageUrl: string, suggestions: any, onClose: () => void }) => {
  const [image] = useImage(imageUrl, 'anonymous');
  const [textLayers, setTextLayers] = useState<{ id: string, text: string, x: number, y: number, fontSize: number, color: string }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (suggestions?.layers) {
      const initialLayers = suggestions.layers.slice(0, 2).map((text: string, i: number) => ({
        id: `text-${i}`,
        text: text.replace(/['"]/g, ''),
        x: 50,
        y: 100 + (i * 60),
        fontSize: i === 0 ? 40 : 24,
        color: '#ffffff'
      }));
      setTextLayers(initialLayers);
    }
  }, [suggestions]);

  const handleDownload = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'meta-ad-elite.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div className="bg-[var(--bg-secondary)] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh]">
        {/* Canvas Area */}
        <div className="flex-1 bg-zinc-900 flex items-center justify-center overflow-hidden relative p-4">
          <div className="bg-white shadow-2xl">
            <Stage 
              width={500} 
              height={500} 
              ref={stageRef}
              onMouseDown={(e) => {
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) setSelectedId(null);
              }}
            >
              <Layer>
                {image && <KonvaImage image={image} width={500} height={500} />}
                {textLayers.map((layer) => (
                  <Text
                    key={layer.id}
                    id={layer.id}
                    text={layer.text}
                    x={layer.x}
                    y={layer.y}
                    fontSize={layer.fontSize}
                    fill={layer.color}
                    draggable
                    fontStyle="bold"
                    fontFamily="Inter"
                    onClick={() => setSelectedId(layer.id)}
                    onTap={() => setSelectedId(layer.id)}
                    onDragEnd={(e) => {
                      const newLayers = textLayers.map(l => l.id === layer.id ? { ...l, x: e.target.x(), y: e.target.y() } : l);
                      setTextLayers(newLayers);
                    }}
                  />
                ))}
                {selectedId && (
                  <Transformer
                    ref={(node) => {
                      if (node && selectedId) {
                        const selectedNode = node.getStage()?.findOne('#' + selectedId);
                        if (selectedNode) {
                          node.nodes([selectedNode]);
                          node.getLayer()?.batchDraw();
                        }
                      }
                    }}
                  />
                )}
              </Layer>
            </Stage>
          </div>
          <p className="absolute bottom-4 left-4 text-[10px] text-zinc-500 uppercase tracking-widest">Elite Canvas v1.0</p>
        </div>

        {/* Controls Area */}
        <div className="w-full md:w-80 border-l border-[var(--border)] p-8 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Elite Editor</h3>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                <XCircle className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-3">Active Layers</label>
                <div className="space-y-3">
                  {textLayers.map((layer) => (
                    <div 
                      key={layer.id} 
                      onClick={() => setSelectedId(layer.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${selectedId === layer.id ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/10' : 'border-[var(--border)] hover:border-blue-400'}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <TypeIcon className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-medium truncate">{layer.text}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setTextLayers(textLayers.filter(l => l.id !== layer.id));
                          if (selectedId === layer.id) setSelectedId(null);
                        }}
                        className="p-1 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setTextLayers([...textLayers, { id: `text-${Date.now()}`, text: 'New Text', x: 50, y: 250, fontSize: 24, color: '#ffffff' }])}
                    className="w-full py-2 border border-dashed border-[var(--border)] rounded-xl text-[10px] font-bold uppercase text-[var(--text-secondary)] hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    + Add Text Layer
                  </button>
                </div>
              </div>

              {selectedId && (
                <div className="space-y-4 pt-4 border-t border-[var(--border)]">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block">Edit Text</label>
                  <input 
                    type="text" 
                    className="input-field text-sm"
                    value={textLayers.find(l => l.id === selectedId)?.text || ''}
                    onChange={(e) => {
                      const newLayers = textLayers.map(l => l.id === selectedId ? { ...l, text: e.target.value } : l);
                      setTextLayers(newLayers);
                    }}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Size</label>
                      <input 
                        type="number" 
                        className="input-field text-sm"
                        value={textLayers.find(l => l.id === selectedId)?.fontSize || 24}
                        onChange={(e) => {
                          const newLayers = textLayers.map(l => l.id === selectedId ? { ...l, fontSize: parseInt(e.target.value) } : l);
                          setTextLayers(newLayers);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Color</label>
                      <input 
                        type="color" 
                        className="w-full h-10 rounded-lg cursor-pointer border-none"
                        value={textLayers.find(l => l.id === selectedId)?.color || '#ffffff'}
                        onChange={(e) => {
                          const newLayers = textLayers.map(l => l.id === selectedId ? { ...l, color: e.target.value } : l);
                          setTextLayers(newLayers);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleDownload}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
            >
              <Save className="w-4 h-4" /> Save & Download
            </button>
            <p className="text-[10px] text-center text-[var(--text-secondary)]">Changes are applied to the final export.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [objective, setObjective] = useState('Sales');
  const [tone, setTone] = useState('Urgent & Trust-building');
  const [language, setLanguage] = useState('Roman Urdu');
  const [copyStyle, setCopyStyle] = useState('Standard');
  const [generateImage, setGenerateImage] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdResult | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const generateAds = async () => {
    if (!productName || !productDesc) {
      setError("Please provide at least the product name and description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setGeneratedImageUrl(null);

    try {
      // Dynamic import to avoid fetch polyfill issues at load time
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // 1. Generate Text Content
      const textPrompt = `
        You are MetaAdsPro Elite – Pakistan's premium AI-powered Meta Ads Creation Studio (2026 edition).
        
        INPUT:
        - Product Name: ${productName}
        - Product Description: ${productDesc}
        - Target Audience: ${targetAudience || 'General Pakistan market'}
        - Objective: ${objective}
        - Tone: ${tone}
        - Selected Language: ${language}
        - Ad Copy Style: ${copyStyle}
        
        TASK:
        1. Build a detailed Audience Persona (Feature 1).
        2. Generate 5-7 high-converting ad copy variations in ${language} using the ${copyStyle} style.
        3. Generate matching targeting suggestions.
        4. Calculate an Alignment Score (0-100) for each variation.
        5. Provide extra suggestions: Image prompts and performance predictions.
        6. If image generation is requested, provide image editor suggestions (layers, fonts, positioning).
        
        LOCALIZATION:
        Focus on Pakistan market. Mention COD, trust signals, urgency, and local references.
        
        OUTPUT FORMAT:
        Return ONLY a JSON object matching this structure:
        {
          "persona": "string",
          "targeting": {
            "advantagePlusMode": "string",
            "seedInterests": ["string"],
            "exclusions": ["string"],
            "location": "string"
          },
          "variations": [
            {
              "alignmentScore": number,
              "primaryText": "string",
              "headline": "string",
              "description": "string",
              "cta": "string",
              "framework": "string"
            }
          ],
          "extraSuggestions": {
            "imagePrompts": ["string"],
            "urgencyHooks": ["string"],
            "performancePrediction": "string"
          },
          "imageEditorSuggestions": {
            "layers": ["string"],
            "fonts": "string",
            "positioning": "string"
          }
        }
      `;

      const textResponse = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: textPrompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(textResponse.text || '{}');
      setResult(data);

      // 2. Generate Image if requested
      if (generateImage && data.extraSuggestions.imagePrompts.length > 0) {
        const imagePrompt = `Professional Meta Ad for ${productName}. ${data.extraSuggestions.imagePrompts[0]}. Style: Clean, high-end, photorealistic, premium graphic, minimal text overlay, 1080x1080 resolution. Pakistan market aesthetic.`;
        
        const imageResponse = await ai.models.generateContent({
          model: IMAGE_MODEL,
          contents: {
            parts: [{ text: imagePrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1"
            }
          }
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate premium ad pack. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
    if (score >= 60) return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
    return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                MetaAdsPro <span className="text-blue-600">Elite</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-secondary)]">2026 Premium Edition</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Input Form */}
          <div className="lg:col-span-4 space-y-8">
            <section className="premium-card p-8 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Layout className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold">Campaign Studio</h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Language</label>
                  <div className="relative">
                    <select 
                      className="input-field appearance-none pr-10"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.label}</option>
                      ))}
                    </select>
                    <Languages className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Product / Service</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Premium Silk Suits" 
                    className="input-field"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Description & Offer</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your product and any special offers (e.g. 20% off, Free Delivery)..." 
                    className="input-field resize-none"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Target Audience</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Women 25-40 in Lahore/Karachi" 
                    className="input-field"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Objective</label>
                    <select 
                      className="input-field appearance-none"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                    >
                      <option>Sales</option>
                      <option>Leads</option>
                      <option>Traffic</option>
                      <option>App Promotion</option>
                      <option>Engagement</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Copy Style</label>
                    <select 
                      className="input-field appearance-none"
                      value={copyStyle}
                      onChange={(e) => setCopyStyle(e.target.value)}
                    >
                      {AD_COPY_STYLES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Tone</label>
                  <select 
                    className="input-field appearance-none"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option>Premium</option>
                    <option>Urgent</option>
                    <option>Friendly</option>
                    <option>Trust-building</option>
                  </select>
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={generateImage}
                        onChange={(e) => setGenerateImage(e.target.checked)}
                      />
                      <div className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-blue-600 transition-colors">Generate Professional Ad Image?</span>
                  </label>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-2 ml-15">Powered by Nano Banana 2.5 Fast Model</p>
                </div>
              </div>

              <button 
                onClick={generateAds}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Crafting Excellence...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Generate Elite Ad Pack
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </div>
              )}
            </section>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 premium-card border-dashed"
                >
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/5 rounded-3xl flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-blue-600/30" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Your Premium Ad Studio</h3>
                  <p className="text-[var(--text-secondary)] max-w-md leading-relaxed">
                    Fill in your campaign details to generate high-converting ad copies, precise targeting, and AI-powered visuals tailored for the Pakistan market.
                  </p>
                </motion.div>
              ) : loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="h-40 bg-[var(--bg-secondary)] animate-pulse rounded-3xl border border-[var(--border)]" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64 bg-[var(--bg-secondary)] animate-pulse rounded-3xl border border-[var(--border)]" />
                    <div className="h-64 bg-[var(--bg-secondary)] animate-pulse rounded-3xl border border-[var(--border)]" />
                  </div>
                  <div className="h-96 bg-[var(--bg-secondary)] animate-pulse rounded-3xl border border-[var(--border)]" />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-10 pb-20"
                >
                  {/* Persona & Targeting Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="premium-card p-8 relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <Smartphone className="w-32 h-32" />
                      </div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600">Audience Persona</h3>
                      </div>
                      <p className="text-[var(--text-primary)] leading-relaxed text-sm italic font-medium">
                        "{result?.persona}"
                      </p>
                    </section>

                    <section className="premium-card p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Target className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600">Targeting Strategy</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase block mb-1.5">Advantage+ Mode</span>
                          <p className="text-sm font-semibold">{result?.targeting.advantagePlusMode}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase block mb-1.5">Seed Interests</span>
                          <div className="flex flex-wrap gap-2">
                            {result?.targeting.seedInterests.map((interest, idx) => (
                              <span key={idx} className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full text-xs font-medium">{interest}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Image Generation Result */}
                  {generatedImageUrl && (
                    <section className="premium-card overflow-hidden">
                      <div className="p-8 border-b border-[var(--border)] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600">AI Visual Studio</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-[var(--text-secondary)]">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-8 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center">
                          <div className="relative group">
                            <img 
                              src={generatedImageUrl} 
                              alt="Generated Ad" 
                              className="w-full max-w-[400px] aspect-square object-cover rounded-2xl shadow-2xl"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                              <button 
                                onClick={() => setShowEditor(true)}
                                className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                              >
                                <Edit3 className="w-4 h-4" /> Edit Layers
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="p-8 space-y-6">
                          <div>
                            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase mb-3 flex items-center gap-2">
                              <Layers className="w-3 h-3" /> Editor Suggestions
                            </h4>
                            <ul className="space-y-3">
                              {result?.imageEditorSuggestions?.layers.map((layer, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5" />
                                  <span className="text-[var(--text-primary)]">{layer}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                            <span className="text-[10px] font-bold text-blue-600 uppercase block mb-1">Typography & Layout</span>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                              {result?.imageEditorSuggestions?.fonts}. {result?.imageEditorSuggestions?.positioning}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Ad Variations */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-xl font-bold flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        Ad Copy Variations
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] uppercase">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        High Alignment Guaranteed
                      </div>
                    </div>

                    <div className="space-y-6">
                      {result?.variations.map((v, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="premium-card overflow-hidden group"
                        >
                          <div className="px-8 py-5 border-b border-[var(--border)] flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase">Variation {idx + 1}</span>
                              <span className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full text-[10px] font-bold text-[var(--text-secondary)] uppercase">{v.framework}</span>
                            </div>
                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold ${getScoreColor(v.alignmentScore)}`}>
                              <CheckCircle2 className="w-4 h-4" />
                              Alignment: {v.alignmentScore}%
                            </div>
                          </div>
                          <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-8 space-y-6">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Primary Text</label>
                                  <button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(v.primaryText);
                                      // Optional: Add a toast notification here
                                    }}
                                    className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all border border-blue-100 dark:border-blue-500/20"
                                  >
                                    <Copy className="w-3 h-3" /> Copy Text
                                  </button>
                                </div>
                                <div className="p-5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl text-sm leading-relaxed whitespace-pre-wrap">
                                  {v.primaryText}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                                <div className="sm:col-span-8">
                                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Headline</label>
                                  <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm font-bold overflow-hidden text-ellipsis">
                                    {v.headline}
                                  </div>
                                </div>
                                <div className="sm:col-span-4">
                                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest block mb-2">Call to Action</label>
                                  <div className="p-4 bg-blue-600 text-white rounded-xl text-sm font-bold text-center shadow-lg shadow-blue-600/20">
                                    {v.cta}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 flex flex-col justify-center border border-[var(--border)]">
                              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase block mb-4">Meta Preview</span>
                              <div className="space-y-3">
                                <div className="h-2 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-xl mt-4" />
                                <div className="flex items-center justify-between mt-4">
                                  <div className="h-3 w-24 bg-zinc-300 dark:bg-zinc-700 rounded" />
                                  <div className="h-8 w-20 bg-blue-600 rounded-lg" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Stats/Tips */}
                  <section className="premium-card p-8 bg-blue-600 text-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 p-12 opacity-10">
                      <TrendingUp className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">Elite Performance Prediction</h3>
                        <p className="text-blue-100 leading-relaxed mb-6">
                          {result?.extraSuggestions.performancePrediction}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {result?.extraSuggestions.urgencyHooks.map((hook, idx) => (
                            <span key={idx} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold border border-white/10">
                              {hook}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                        <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> A/B Testing Strategy
                        </h4>
                        <ul className="space-y-3 text-sm text-blue-50">
                          <li className="flex items-center gap-3">
                            <ArrowRight className="w-4 h-4 text-blue-300" />
                            Test Variation 1 vs 3 for emotional hook.
                          </li>
                          <li className="flex items-center gap-3">
                            <ArrowRight className="w-4 h-4 text-blue-300" />
                            Use Advantage+ Creative for automatic optimization.
                          </li>
                          <li className="flex items-center gap-3">
                            <ArrowRight className="w-4 h-4 text-blue-300" />
                            Monitor ROAS closely for the first 72 hours.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Image Editor Overlay */}
      <AnimatePresence>
        {showEditor && generatedImageUrl && (
          <EliteImageEditor 
            imageUrl={generatedImageUrl} 
            suggestions={result?.imageEditorSuggestions} 
            onClose={() => setShowEditor(false)} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
              <Sparkles className="text-zinc-500 w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">MetaAdsPro Elite</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            © 2026 Premium Ad Intelligence • Built for Excellence in Pakistan
          </p>
          <div className="flex items-center gap-6 text-[var(--text-secondary)]">
            <Globe className="w-4 h-4" />
            <TrendingUp className="w-4 h-4" />
            <Smartphone className="w-4 h-4" />
          </div>
        </div>
      </footer>
    </div>
  );
}
