import React from 'react';
import { CheckCircle, Clock, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: 'lent' | 'borrowed';
  amount: number;
  person: string;
  date: Date;
  status: 'pending' | 'paid';
  description?: string;
  dueDate?: Date;
}

interface TransactionCardProps {
  transaction: Transaction;
  onUpdate: (id: string, updates: Partial<Transaction>) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onUpdate }) => {
  const { id, type, amount, person, date, status, description, dueDate } = transaction;

  const isOverdue = dueDate && new Date() > dueDate && status === 'pending';
  
  const cardVariant = type === 'lent' 
    ? 'bg-gradient-to-r from-lent-light/30 to-lent-light/10 border-lent/30' 
    : 'bg-gradient-to-r from-borrowed-light/30 to-borrowed-light/10 border-borrowed/30';

  const amountColor = type === 'lent' ? 'text-lent' : 'text-borrowed';
  const typeColor = type === 'lent' ? 'bg-lent text-lent-foreground' : 'bg-borrowed text-borrowed-foreground';

  const handleMarkAsPaid = () => {
    onUpdate(id, { status: 'paid' });
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${cardVariant} ${status === 'paid' ? 'opacity-70' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className={typeColor}>
                {type === 'lent' ? 'Lent' : 'Borrowed'}
              </Badge>
              {status === 'paid' && (
                <Badge variant="secondary" className="bg-success text-success-foreground">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Paid
                </Badge>
              )}
              {isOverdue && (
                <Badge variant="destructive">
                  <Clock className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{person}</span>
              </div>
              
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(date, 'MMM dd, yyyy')}
                </div>
                {dueDate && status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Due: {format(dueDate, 'MMM dd, yyyy')}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${amountColor} mb-2`}>
              ${amount}
            </div>
            {status === 'pending' && (
              <Button
                size="sm"
                onClick={handleMarkAsPaid}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Paid
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};