
import { FC, useState } from 'react';
import { ExpenseGroup } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Settings, Pencil, Trash2 } from 'lucide-react';
import { useExpenseGroups } from '@/hooks/useExpenseGroups';

export const ExpenseGroupManager: FC<{ className?: string }> = ({ className }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroup, setEditingGroup] = useState<ExpenseGroup | null>(null);
  const { groups, addGroup, updateGroup, deleteGroup } = useExpenseGroups();

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName("");
    }
  };

  const handleUpdate = (originalGroup: ExpenseGroup) => {
    if (editingGroup && editingGroup.name.trim() && editingGroup.name.trim() !== originalGroup.name) {
      updateGroup(editingGroup, {
        onSuccess: () => setEditingGroup(null)
      });
    } else {
      setEditingGroup(null);
    }
  };

  return (
    <Dialog onOpenChange={() => setEditingGroup(null)}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}><Settings className="mr-2 h-4 w-4"/>Administrar Grupos</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Administrar Grupos de Gastos</DialogTitle>
          <DialogDescription>Añade, edita o elimina grupos de gastos.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Nuevo nombre de grupo" />
            <Button onClick={handleAddGroup} disabled={!newGroupName.trim()}>Añadir</Button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {groups.map(group => (
              <div key={group.id} className="flex items-center justify-between gap-2 rounded-md border p-2">
                {editingGroup?.id === group.id ? (
                  <Input 
                    value={editingGroup.name} 
                    onChange={e => setEditingGroup({...editingGroup, name: e.target.value})}
                    onBlur={() => handleUpdate(group)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdate(group);
                      if (e.key === 'Escape') setEditingGroup(null);
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="flex-1" onDoubleClick={() => setEditingGroup(group)}>{group.name}</span>
                )}
                <div className="flex gap-1">
                   <Button variant="ghost" size="icon" onClick={() => setEditingGroup(group)}>
                      <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteGroup(group.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
