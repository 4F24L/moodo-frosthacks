import React from 'react';
import { MessageSquare, ArrowRight, Sparkles } from 'lucide-react';

const moodPrompts = [
  "Feeling stressed about work",
  "Had a great day today",
  "Feeling anxious",
  "Grateful for my friends",
  "Overwhelmed with tasks",
  "Excited about the future"
];

const TextEmotionInput = ({ value, onChange, onSubmit, isProcessing }) => {
  const handlePromptClick = (prompt) => {
    onChange({ target: { value: prompt } });
  };

  return (
    <div className="bg-card rounded-3xl p-4 md:p-5 shadow-sm border border-border space-y-2.5 flex flex-col">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-bold text-foreground text-sm md:text-base">Spill your thoughts</h3>
      </div>

      {/* Quick Mood Prompts */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-medium">Quick prompts:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {moodPrompts.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              disabled={isProcessing}
              className="px-2.5 py-1.5 bg-muted hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border rounded-xl text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-2.5 mt-10">
        <textarea
          value={value}
          onChange={onChange}
          placeholder="What's the vibe today? Type it out..."
          className="w-full h-24 md:h-28 p-3 md:p-4 bg-muted border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:bg-card transition-all outline-none text-sm resize-none"
        />
        <button
          type="submit"
          disabled={isProcessing || !value.trim()}
          className="w-full py-2.5 md:py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-bold rounded-xl shadow-md shadow-primary/10 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Check Vibe <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>
    </div>
  );
};

export default TextEmotionInput;
