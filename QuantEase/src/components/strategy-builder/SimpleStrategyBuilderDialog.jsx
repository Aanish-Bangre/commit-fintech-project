import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SimpleStrategyBuilderDialog = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Strategy Builder - Test</DialogTitle>
          <DialogDescription>
            Testing the strategy builder modal functionality.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <h2 className="text-lg mb-4">Strategy Builder is Working!</h2>
          <p className="mb-4">This is a test dialog to confirm the modal functionality works.</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleStrategyBuilderDialog;
