import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Comentario: Componente para listar y crear usuarios usando SQLite (vía IPC).
export function UserList() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Comentario: Cargar usuarios al montar el componente.
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            if (window.api?.db) {
                const data = await window.api.db.getUsers();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) return;

        setLoading(true);
        try {
            if (window.api?.db) {
                await window.api.db.createUser({ name, email });
                setName('');
                setEmail('');
                loadUsers();
            }
        } catch (error) {
            console.error('Error creating user:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Gestión de Usuarios (SQLite)</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
                    <Input
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? '...' : 'Crear'}
                    </Button>
                </form>

                <div className="space-y-2">
                    {users.length === 0 ? (
                        <p className="text-sm text-center text-muted-foreground">No hay usuarios registrados.</p>
                    ) : (
                        users.map((user) => (
                            <div key={user.id} className="p-3 border rounded-lg flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-muted-foreground">{user.email}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
