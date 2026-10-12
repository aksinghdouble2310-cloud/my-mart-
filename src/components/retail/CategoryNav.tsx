import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import {
  Wheat,
  Droplet,
  Bean,
  Flame,
  Utensils,
  Coffee,
  Sparkles,
  PackageCheck,
  ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Wheat,
  Droplet,
  Bean,
  Flame,
  Utensils,
  Coffee,
  Sparkles,
  PackageCheck,
};

export const CategoryNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setActiveTab, language } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900">
            {language === 'ne' ? 'मुख्य वर्गहरू' : 'Browse Product Categories'}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Essential grains, cooking oils, lentils, instant foods, and wholesale cartons
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
          >
            Show All Categories
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {INITIAL_CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.iconName] || Wheat;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(isSelected ? null : cat.id);
                setActiveTab('categories');
              }}
              className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-700'
                  : 'border-neutral-200/80 bg-white hover:border-neutral-300 hover:shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                  isSelected
                    ? 'bg-emerald-800 text-white'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-neutral-900 block leading-tight truncate w-full">
                {language === 'ne' ? cat.nepaliName : cat.name}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                {cat.itemCount} items
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
