import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionCard } from '@/components/TransactionCard';
import { AddTransactionDialog } from '@/components/AddTransactionDialog';

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

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'lent',
      amount: 150,
      person: 'Sarah Johnson',
      date: new Date('2024-01-15'),
      status: 'pending',
      description: 'Dinner payment',
      dueDate: new Date('2024-02-15')
    },
    {
      id: '2',
      type: 'borrowed',
      amount: 80,
      person: 'Mike Chen',
      date: new Date('2024-01-10'),
      status: 'pending',
      description: 'Movie tickets',
      dueDate: new Date('2024-02-10')
    },
    {
      id: '3',
      type: 'lent',
      amount: 200,
      person: 'Alex Rivera',
      date: new Date('2024-01-05'),
      status: 'paid',
      description: 'Lunch bill'
    }
  ]);

  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const totalLent = transactions
    .filter(t => t.type === 'lent' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBorrowed = transactions
    .filter(t => t.type === 'borrowed' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const uniquePeople = new Set(transactions.map(t => t.person)).size;

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleUpdateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const completedTransactions = transactions.filter(t => t.status === 'paid');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                Money Tracker
              </h1>
              <p className="text-muted-foreground mt-1">Keep track of your personal loans and debts</p>
            </div>
            <Button 
              onClick={() => setShowAddTransaction(true)}
              className="bg-primary hover:bg-primary-hover text-primary-foreground transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-lent-light to-lent-light/50 border-lent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-lent">Money Lent</CardTitle>
              <TrendingUp className="h-4 w-4 text-lent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lent">${totalLent}</div>
              <p className="text-xs text-lent/70 mt-1">Outstanding amount</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-borrowed-light to-borrowed-light/50 border-borrowed/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-borrowed">Money Borrowed</CardTitle>
              <TrendingDown className="h-4 w-4 text-borrowed" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-borrowed">${totalBorrowed}</div>
              <p className="text-xs text-borrowed/70 mt-1">Amount to repay</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniquePeople}</div>
              <p className="text-xs text-muted-foreground mt-1">People involved</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <div className="space-y-6">
          {/* Pending Transactions */}
          {pendingTransactions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-warning" />
                Pending Transactions
              </h2>
              <div className="grid gap-4">
                {pendingTransactions.map(transaction => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onUpdate={handleUpdateTransaction}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Transactions */}
          {completedTransactions.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center text-success">
                <DollarSign className="w-5 h-5 mr-2" />
                Completed Transactions
              </h2>
              <div className="grid gap-4">
                {completedTransactions.map(transaction => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onUpdate={handleUpdateTransaction}
                  />
                ))}
              </div>
            </div>
          )}

          {transactions.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-4">Start tracking your personal loans and debts</p>
              <Button 
                onClick={() => setShowAddTransaction(true)}
                className="bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Transaction
              </Button>
            </div>
          )}
        </div>
      </main>

      <AddTransactionDialog
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        onAdd={handleAddTransaction}
      />
    </div>
  );
};

export default Index;