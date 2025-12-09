"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateCalendarEvent, UpdateCalendarEvent , CalendarEvent } from "@/types/calendar";
import { info, error, success, warn } from "@/lib/helper/logger";

export const getEvents = async () => {
  try {
    info("Fetching calendar events...");
    const events = await prisma.calendarEvent.findMany({
      orderBy: { start: "asc" }
    });
    success("Events fetched successfully", { count: events.length });
    return events as CalendarEvent[];
  } catch (err) {
    error("getEvents error:", err);
    return [];
  }
};

export const createEvent = async (data: CreateCalendarEvent) => {
  try {
    info("Creating new event", data);

    const event = await prisma.calendarEvent.create({ data });

    success("Event created successfully", event);
    revalidatePath("/calendar");

    return { success: true, event: event as CalendarEvent };
  } catch (err) {
    error("createEvent error:", err);
    return { success: false, error: err };
  }
};

export const updateEvent = async (data: UpdateCalendarEvent) => {
  try {
    const { id, ...fields } = data;
    info(`Updating event with id: ${id}`, fields);

    const event = await prisma.calendarEvent.update({
      where: { id },
      data: fields,
    });

    success("Event updated successfully", event);
    revalidatePath("/calendar");

    return { success: true, event: event as CalendarEvent };
  } catch (err) {
    error("updateEvent error:", err);
    return { success: false, error: err };
  }
};

export const deleteEvent = async (id: string) => {
  try {
    warn("Deleting event", { id });

    await prisma.calendarEvent.delete({ where: { id } });

    success("Event deleted successfully", { id });
    revalidatePath("/calendar");

    return { success: true };
  } catch (err) {
    error("deleteEvent error:", err);
    return { success: false, error: err };
  }
};
