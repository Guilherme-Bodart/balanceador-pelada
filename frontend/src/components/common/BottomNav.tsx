import React from 'react';
import { FloatingDock, TabType } from '../ui/FloatingDock';

export type { TabType };

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  selectedCount = 0,
}) => {
  return (
    <FloatingDock
      activeTab={activeTab}
      onTabChange={onTabChange}
      selectedCount={selectedCount}
    />
  );
};
