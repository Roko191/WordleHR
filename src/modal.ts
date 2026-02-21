type ModalType = 'success' | 'error' | 'info';

interface ModalOptions {
  title?: string;
  message: string;
  type?: ModalType;
  content?: string; // HTML content
  showFooter?: boolean;
}

export function showModal(options: string | ModalOptions): Promise<void> {
  const config: ModalOptions = typeof options === 'string' 
    ? { message: options, type: 'info', showFooter: true }
    : { showFooter: true, ...options };
    
  return new Promise((resolve) => {
    const overlay = document.getElementById('modal-overlay') as HTMLElement;
    const modal = document.getElementById('modal') as HTMLElement;
    const titleEl = document.getElementById('modal-title') as HTMLElement;
    const messageEl = document.getElementById('modal-message') as HTMLElement;
    const contentEl = document.getElementById('modal-content') as HTMLElement;
    const closeBtn = document.getElementById('modal-close') as HTMLElement;
    const closeX = document.getElementById('modal-close-x') as HTMLElement;
    const footer = closeBtn.parentElement as HTMLElement;
    
    // Set title
    if (config.title) {
      titleEl.textContent = config.title;
      titleEl.parentElement?.classList.remove('hidden');
    } else {
      titleEl.parentElement?.classList.add('hidden');
    }
    
    // Set message
    messageEl.textContent = config.message;
    
    // Set optional content
    if (config.content) {
      contentEl.innerHTML = config.content;
      contentEl.classList.remove('hidden');
    } else {
      contentEl.innerHTML = '';
      contentEl.classList.add('hidden');
    }
    
    // Show/hide footer
    if (config.showFooter === false) {
      footer.classList.add('hidden');
    } else {
      footer.classList.remove('hidden');
    }
    
    // Style based on type
    if (config.type === 'success') {
      closeBtn.className = 'bg-[#538d4e] hover:bg-[#6aaa64] text-white font-bold py-3 px-8 rounded uppercase text-sm tracking-wider transition-all duration-200';
    } else if (config.type === 'error') {
      closeBtn.className = 'bg-[#3a3a3c] hover:bg-[#565758] text-white font-bold py-3 px-8 rounded uppercase text-sm tracking-wider transition-all duration-200';
    } else {
      closeBtn.className = 'bg-[#538d4e] hover:bg-[#6aaa64] text-white font-bold py-3 px-8 rounded uppercase text-sm tracking-wider transition-all duration-200';
    }
    
    // Show modal with animation
    overlay.classList.remove('hidden');
    overlay.classList.add('modal-overlay-enter');
    modal.classList.add('modal-enter');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    const close = () => {
      // Exit animation
      overlay.classList.add('modal-overlay-exit');
      modal.classList.add('modal-exit');
      
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('modal-overlay-enter', 'modal-overlay-exit');
        modal.classList.remove('modal-enter', 'modal-exit');
        document.body.style.overflow = '';
        
        closeBtn.removeEventListener('click', close);
        closeX.removeEventListener('click', close);
        overlay.removeEventListener('click', handleOverlayClick);
        document.removeEventListener('keydown', handleEscape);
        
        resolve();
      }, 200);
    };
    
    const handleOverlayClick = (e: MouseEvent) => {
      if (e.target === overlay) close();
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    
    closeBtn.addEventListener('click', close);
    closeX.addEventListener('click', close);
    overlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleEscape);
  });
}