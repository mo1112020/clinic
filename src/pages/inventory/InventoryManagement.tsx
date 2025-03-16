
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Plus, ShoppingCart, ArrowUpDown, Pill, Syringe, Thermometer, Scissors, ShoppingBag, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion } from 'framer-motion';
import { useInventory } from '@/hooks/use-inventory';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const InventoryManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<string | undefined>(undefined);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();
  
  // Form state for new inventory item
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    stock: 0,
    price: 0,
    reorderLevel: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use the custom hook to fetch inventory data from Supabase
  const { inventoryItems, stats, isLoading, error } = useInventory(
    searchQuery,
    categoryFilter,
    stockFilter,
    sortBy,
    sortDirection
  );
  
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vaccine':
        return <Syringe className="h-4 w-4" />;
      case 'medication':
        return <Pill className="h-4 w-4" />;
      case 'supplies':
        return <Scissors className="h-4 w-4" />;
      case 'food':
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };
  
  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'bg-destructive text-destructive-foreground' };
    if (stock < reorderLevel) return { label: 'Low Stock', className: 'bg-amber-500 text-white' };
    return { label: 'In Stock', className: 'bg-emerald-500 text-white' };
  };
  
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.category) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('inventory')
        .insert({
          name: newItem.name,
          category: newItem.category,
          stock: newItem.stock,
          price: newItem.price,
          reorder_level: newItem.reorderLevel,
          sold: 0
        });
      
      if (error) throw error;
      
      toast({
        title: 'Item added',
        description: `${newItem.name} has been added to inventory.`,
      });
      
      setAddItemDialogOpen(false);
      setNewItem({
        name: '',
        category: '',
        stock: 0,
        price: 0,
        reorderLevel: 0
      });
      
      // Refresh the page to show the new item
      window.location.reload();
      
    } catch (err) {
      console.error('Error adding inventory item:', err);
      toast({
        title: 'Error',
        description: 'Failed to add inventory item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">Manage your clinic's stock and supplies.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-3xl font-bold">{isLoading ? '-' : stats.totalItems}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                <p className="text-3xl font-bold">{isLoading ? '-' : stats.lowStockItems}</p>
              </div>
              <div className="p-2 bg-amber-500/10 rounded-full">
                <ShoppingCart className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-3xl font-bold">${isLoading ? '-' : stats.totalValue.toFixed(2)}</p>
              </div>
              <div className="p-2 bg-emerald-500/10 rounded-full">
                <Thermometer className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Manage your clinic's stock and supplies</CardDescription>
            </div>
            <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new item to add to inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input 
                      id="item-name" 
                      placeholder="Enter item name" 
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => setNewItem({...newItem, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vaccine">Vaccine</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Initial Stock</Label>
                      <Input 
                        id="stock" 
                        type="number" 
                        placeholder="0" 
                        value={newItem.stock.toString()}
                        onChange={(e) => setNewItem({...newItem, stock: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        value={newItem.price.toString()}
                        onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorder-level">Reorder Level</Label>
                    <Input 
                      id="reorder-level" 
                      type="number" 
                      placeholder="Enter quantity"
                      value={newItem.reorderLevel.toString()}
                      onChange={(e) => setNewItem({...newItem, reorderLevel: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddItemDialogOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" onClick={handleAddItem} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Item'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-9 glass-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div>
                <ToggleGroup 
                  type="multiple" 
                  className="justify-start flex-wrap"
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <ToggleGroupItem value="vaccine" className="gap-1">
                    <Syringe className="h-3.5 w-3.5" />
                    Vaccines
                  </ToggleGroupItem>
                  <ToggleGroupItem value="medication" className="gap-1">
                    <Pill className="h-3.5 w-3.5" />
                    Medications
                  </ToggleGroupItem>
                  <ToggleGroupItem value="supplies" className="gap-1">
                    <Scissors className="h-3.5 w-3.5" />
                    Supplies
                  </ToggleGroupItem>
                  <ToggleGroupItem value="food" className="gap-1">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Food
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div>
                <ToggleGroup 
                  type="single" 
                  className="justify-start"
                  value={stockFilter}
                  onValueChange={setStockFilter}
                >
                  <ToggleGroupItem value="low">Low Stock</ToggleGroupItem>
                  <ToggleGroupItem value="out">Out of Stock</ToggleGroupItem>
                  <ToggleGroupItem value="all">All</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
            
            {/* Table Header */}
            <div className="hidden md:flex items-center border-b pb-2">
              <div className="flex-1 font-medium">
                <Button variant="ghost" className="px-2 font-medium" onClick={() => toggleSort('name')}>
                  Product Name
                  {sortBy === 'name' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </div>
              <div className="w-28 text-center font-medium">
                <Button variant="ghost" className="px-2 font-medium" onClick={() => toggleSort('stock')}>
                  Stock
                  {sortBy === 'stock' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </div>
              <div className="w-28 text-center font-medium">
                <Button variant="ghost" className="px-2 font-medium" onClick={() => toggleSort('price')}>
                  Price
                  {sortBy === 'price' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </div>
              <div className="w-28 text-center font-medium">
                <Button variant="ghost" className="px-2 font-medium" onClick={() => toggleSort('sold')}>
                  Sold
                  {sortBy === 'sold' && (
                    <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </div>
              <div className="w-28 text-center font-medium">Status</div>
            </div>
          
            {/* Items */}
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">Loading inventory items...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                <p>Error loading inventory: {error}</p>
              </div>
            ) : inventoryItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center mb-3">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No items found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inventoryItems.map((item, index) => {
                  const stockStatus = getStockStatus(item.stock, item.reorder_level);
                  
                  return (
                    <motion.div
                      key={item.id}
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      custom={index}
                    >
                      <div className="flex flex-col md:flex-row md:items-center p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        {/* Mobile View */}
                        <div className="md:hidden space-y-3 mb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-muted rounded-full">
                                {getCategoryIcon(item.category)}
                              </div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <Badge className={stockStatus.className}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-muted/50 p-2 rounded">
                              <p className="text-xs text-muted-foreground">Stock</p>
                              <p className="font-medium">{item.stock}</p>
                            </div>
                            <div className="bg-muted/50 p-2 rounded">
                              <p className="text-xs text-muted-foreground">Price</p>
                              <p className="font-medium">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="bg-muted/50 p-2 rounded">
                              <p className="text-xs text-muted-foreground">Sold</p>
                              <p className="font-medium">{item.sold}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Desktop View */}
                        <div className="hidden md:flex md:flex-1 md:items-center">
                          <div className="p-1.5 bg-muted rounded-full mr-3">
                            {getCategoryIcon(item.category)}
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="hidden md:block md:w-28 text-center">{item.stock}</div>
                        <div className="hidden md:block md:w-28 text-center">${item.price.toFixed(2)}</div>
                        <div className="hidden md:block md:w-28 text-center">{item.sold}</div>
                        <div className="hidden md:block md:w-28 text-center">
                          <Badge className={stockStatus.className}>
                            {stockStatus.label}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {isLoading ? 
              'Loading items...' : 
              `Showing ${inventoryItems.length} ${inventoryItems.length === 1 ? 'item' : 'items'}`
            }
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InventoryManagement;
