import React, { useState, useCallback } from 'react';

export const useModal = (items = []) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openModal = useCallback((item) => {
    const index = items.findIndex(i => i.id === item.id);
    setCurrentIndex(index);
    setSelectedItem(item);
    setSidebarOpen(false);
  }, [items]);

  const closeModal = useCallback(() => {
    setSelectedItem(null);
    setSidebarOpen(false);
  }, []);

  const navigateNext = useCallback(() => {
    if (items.length === 0) return;
    const newIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(newIndex);
    setSelectedItem(items[newIndex]);
  }, [items, currentIndex]);

  const navigatePrev = useCallback(() => {
    if (items.length === 0) return;
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(newIndex);
    setSelectedItem(items[newIndex]);
  }, [items, currentIndex]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return {
    selectedItem,
    currentIndex,
    sidebarOpen,
    isOpen: !!selectedItem,
    openModal,
    closeModal,
    navigateNext,
    navigatePrev,
    toggleSidebar,
    hasNext: currentIndex < items.length - 1,
    hasPrev: currentIndex > 0,
  };
};