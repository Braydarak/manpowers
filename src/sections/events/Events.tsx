import React, { useEffect, useState } from 'react';

interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    description: string;
    image: string;
}

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetch('/events.json')
            .then(response => response.json())
            .then(data => setEvents(data));
    }, []);

    const getGridClasses = () => {
        const baseClasses = "grid gap-8 px-4";
        if (events.length === 1) {
            return `${baseClasses} grid-cols-1 max-w-md mx-auto`;
        }
        if (events.length === 2) {
            return `${baseClasses} grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto`;
        }
        return `${baseClasses} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
    };

    return (
        <div className="py-10 bg-black text-center">
            <h2 className="text-3xl font-bold mb-10 text-white">Próximos Eventos</h2>
            <div className={getGridClasses()}>
                {events.map(event => (
                    <div key={event.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                        <img src={event.image} alt={event.title} className="w-full h-48 object-cover"/>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
                            <p className="text-gray-400 mb-2">{new Date(event.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })} - {event.location}</p>
                            <p className="text-gray-300">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;