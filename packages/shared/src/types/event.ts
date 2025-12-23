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
    price?: number; // in cents
    currency?: string;
    isPaid: boolean;
    organizer: string; // User ID
    attendees: IAttendee[];
    type: EventType;
    format: EventFormat;
    status: EventStatus;
    group?: string; // Optional Group ID
    isPublic?: boolean; // For group events: visible to non-members?
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
    price: z.number().min(0).default(0),
    currency: z.string().default('usd'),
    isPaid: z.boolean().default(false),
    type: z.nativeEnum(EventType),
    format: z.nativeEnum(EventFormat),
    groupId: z.string().optional(), // Optional group association
    isPublic: z.boolean().default(true), // For group events: visible to non-members
}).refine(
    (data) => {
        if (data.isPaid) {
            return (data.price || 0) > 0;
        }
        return true;
    },
    {
        message: 'Price must be greater than 0 for paid events',
        path: ['price'],
    },
);

export type CreateEventInput = z.infer<typeof CreateEventSchema>;

// Schema for joining an event with optional positions
export const JoinEventSchema = z.object({
    positions: z.array(z.nativeEnum(EventPosition)).optional(),
});

export type JoinEventInput = z.infer<typeof JoinEventSchema>;

// Schema for updating RSVP status
export const UpdateRSVPSchema = z.object({
    status: z.nativeEnum(AttendeeStatus, {
        errorMap: () => ({ message: 'Invalid status. Must be YES, NO, MAYBE, or WAITLIST' }),
    }),
});

export type UpdateRSVPInput = z.infer<typeof UpdateRSVPSchema>;

// Schema for adding an attendee by email
export const AddAttendeeSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export type AddAttendeeInput = z.infer<typeof AddAttendeeSchema>;

