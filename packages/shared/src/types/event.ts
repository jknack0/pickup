import { z } from 'zod';

export enum EventType {
    VOLLEYBALL = 'VOLLEYBALL',
}

export enum EventFormat {
    OPEN_GYM = 'OPEN_GYM',
    LEAGUE = 'LEAGUE',
    TOURNAMENT = 'TOURNAMENT',
}

export enum EventPosition {
    SETTER = 'Setter',
    OUTSIDE = 'Outside',
    OPPOSITE = 'Opposite',
    MIDDLE = 'Middle',
    LIBERO = 'Libero',
    DS = 'DS',
}

export enum AttendeeStatus {
    YES = 'YES',
    NO = 'NO',
    MAYBE = 'MAYBE',
    WAITLIST = 'WAITLIST',
}

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    CANCELED = 'CANCELED',
}

export interface IAttendee {
    user: string; // User ID
    status: AttendeeStatus;
    positions: EventPosition[];
    joinedAt: Date | string;
}

export interface IEvent {
    _id: string;
    title: string;
    description?: string;
    date: Date | string;
    location: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    organizer: string; // User ID
    attendees: IAttendee[];
    type: EventType;
    format: EventFormat;
    status: EventStatus;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export const CreateEventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    location: z.string().min(3, 'Location must be at least 3 characters'),
    coordinates: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
    type: z.nativeEnum(EventType).default(EventType.VOLLEYBALL),
    format: z.nativeEnum(EventFormat).default(EventFormat.OPEN_GYM),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
