import React, { useState } from 'react';
import { CalendarIcon, Plus, User, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Transaction {
  type: 'lent' | 'borrowed';
  amount: number;
  person: string;
  date: Date;
  status: 'pending' | 'paid';
  description?: string;
  dueDate?: Date;
}

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (transaction: Transaction) => void;
}

export const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onOpenChange,
  onAdd,
}) => {
  const [type, setType] = useState<'lent' | 'borrowed'>('lent');
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !person) return;

    const transaction: Transaction = {
      type,
      amount: parseFloat(amount),
      person: person.trim(),
      date,
      status: 'pending',
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
    };

    onAdd(transaction);
    
    // Reset form
    setAmount('');
    setPerson('');
    setDescription('');
    setDate(new Date());
    setDueDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Transaction
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === 'lent' ? 'default' : 'outline'}
                onClick={() => setType('lent')}
                className={cn(
                  'justify-start',
                  type === 'lent' 
                    ? 'bg-lent hover:bg-lent/90 text-lent-foreground' 
                    : 'hover:bg-lent-light/20 hover:text-lent hover:border-lent/30'
                )}
              >
                I Lent Money
              </Button>
              <Button
                type="button"
                variant={type === 'borrowed' ? 'default' : 'outline'}
                onClick={() => setType('borrowed')}
                className={cn(
                  'justify-start',
                  type === 'borrowed' 
                    ? 'bg-borrowed hover:bg-borrowed/90 text-borrowed-foreground' 
                    : 'hover:bg-borrowed-light/20 hover:text-borrowed hover:border-borrowed/30'
                )}
              >
                I Borrowed Money
              </Button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="text-lg"
            />
          </div>

          {/* Person */}
          <div className="space-y-2">
            <Label htmlFor="person" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Person's Name
            </Label>
            <Input
              id="person"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="Enter the person's name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              rows={2}
            />
          </div>

          {/* Transaction Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Transaction Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Due Date (Optional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Set reminder date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
            disabled={!amount || !person}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};