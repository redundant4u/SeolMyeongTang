import { useState } from 'react';
import { CreateSessionRequest } from 'types/session';

type PropTypes = {
    isOpen: boolean;
    onModalClose: () => void;
    onCreateSession: (data: CreateSessionRequest) => void;
};

const CreateSessionModal = ({ isOpen, onModalClose, onCreateSession }: PropTypes) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('debian-xfce');

    const images = [
        { value: 'debian-xfce', label: 'debian-xfce' },
        { value: 'ubuntu', label: 'ubuntu' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        console.log(name, image);
        e.preventDefault();
        onCreateSession({ name, image });
        setName('');
        setImage('debian-xfce');
    };

    const handleClose = () => {
        setName('');
        setImage('debian-xfce');
        onModalClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">Create New VNC</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            VNC Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter VNC name"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-500"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="image"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Image
                        </label>
                        <select
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        >
                            {images.map((image) => (
                                <option key={image.value} value={image.value}>
                                    {image.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 disabled:opacity-50 dark:focus:ring-offset-0"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSessionModal;
