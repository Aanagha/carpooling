import { useEffect, useState } from 'react';
import { client, databases } from '@/lib/appwrite';

const Notifications = ({ userId }: { userId: string | null }) => {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (userId) {
            const unsubscribe = client.subscribe(
                `databases.${process.env.NEXT_PUBLIC_DB_ID}.collections.notifications.documents`,
                (response) => {
                    const notification : any = response.payload;
                    if (notification.userId === userId) {
                        setNotifications((prev) => [notification, ...prev]);
                    }
                }
            );

            return () => unsubscribe();
        }
    }, [userId]);

    const markAsRead = async (notificationId: string) => {
        try {
            await databases.updateDocument(
                process.env.NEXT_PUBLIC_DB_ID as string,
               process.env.NEXT_PUBLIC_NOTIFICATION_COLLECTION_ID as string,
                notificationId,
                { read: true }
            );
            setNotifications((prev) => prev.map((n) => (n.$id === notificationId ? { ...n, read: true } : n)));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div
                        key={notification.$id}
                        className={`p-4 mb-2 border rounded ${notification.read ? 'bg-gray-100' : 'bg-white'}`}
                    >
                        <p>{notification.message}</p>
                        <small>{new Date(notification.timestamp).toLocaleString()}</small>
                        {!notification.read && (
                            <button
                                onClick={() => markAsRead(notification.$id)}
                                className="ml-4 text-blue-500 underline"
                            >
                                Mark as Read
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>No notifications.</p>
            )}
        </div>
    );
};

export default Notifications;
