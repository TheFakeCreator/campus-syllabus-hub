import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    title: z.string().min(3),
    url: z.string().url(),
    type: z.string(),
    tags: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof schema>;

export const ContributeForm: React.FC<{ userRole: string; onSubmit: (data: FormData) => void }> = ({ userRole, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

    if (userRole !== 'moderator' && userRole !== 'admin') return null;

    return (
        <form className="space-y-4 p-4 border rounded-lg" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Title</label>
                <input {...register('title')} className="input" />
                {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
            </div>
            <div>
                <label>URL</label>
                <input {...register('url')} className="input" />
                {errors.url && <span className="text-red-500 text-xs">{errors.url.message}</span>}
            </div>
            <div>
                <label>Type</label>
                <input {...register('type')} className="input" />
                {errors.type && <span className="text-red-500 text-xs">{errors.type.message}</span>}
            </div>
            <div>
                <label>Tags</label>
                <input {...register('tags.0')} className="input" placeholder="Tag 1" />
                <input {...register('tags.1')} className="input" placeholder="Tag 2" />
            </div>
            <button type="submit" className="btn btn-primary">Contribute</button>
        </form>
    );
};
