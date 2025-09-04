import { Request, Response } from 'express';
import { CreateDumpInput, DumpStatus, ApiResponse, AggregationResult } from '@ekotracker/shared';
import prisma from '../services/database';
import { calculateWeight, shouldSendNotification } from '../services/weight';
import { sendNotificationEmail } from '../services/notification';

const AGGREGATION_RADIUS = 0.0003; // ~30 meters in degrees

export async function createDump(req: Request, res: Response) {
  try {
    const dumpData: CreateDumpInput = req.body;

    // Validate input
    if (!dumpData.description || !dumpData.latitude || !dumpData.longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: description, latitude, longitude'
      });
    }

    if (dumpData.urgency < 1 || dumpData.urgency > 5 || dumpData.appearance < 1 || dumpData.appearance > 5) {
      return res.status(400).json({
        success: false,
        error: 'Urgency and appearance must be between 1 and 5'
      });
    }

    // Find municipality (for now, assign to first available)
    const municipality = await prisma.municipality.findFirst();
    if (!municipality) {
      return res.status(500).json({
        success: false,
        error: 'No municipality found. Please run seed script first.'
      });
    }

    // Check for existing dump in radius for aggregation
    const existingDump = await prisma.dump.findFirst({
      where: {
        status: DumpStatus.ACTIVE,
        latitude: {
          gte: dumpData.latitude - AGGREGATION_RADIUS,
          lte: dumpData.latitude + AGGREGATION_RADIUS,
        },
        longitude: {
          gte: dumpData.longitude - AGGREGATION_RADIUS,
          lte: dumpData.longitude + AGGREGATION_RADIUS,
        },
      },
    });

    if (existingDump) {
      // Aggregate into existing dump
      const newReportsCount = existingDump.reportsCount + 1;
      const newWeight = calculateWeight({
        urgency: existingDump.urgency,
        appearance: existingDump.appearance,
        environmentType: existingDump.environmentType,
        reportsCount: newReportsCount,
      });

      const updatedDump = await prisma.dump.update({
        where: { id: existingDump.id },
        data: {
          reportsCount: newReportsCount,
          weight: newWeight,
        },
        include: { municipality: true },
      });

      // Check if notification should be sent
      if (shouldSendNotification(newWeight)) {
        await sendNotificationEmail(
          municipality.email,
          updatedDump.id,
          newWeight,
          updatedDump.description
        );
      }

      const response: ApiResponse<AggregationResult> = {
        success: true,
        data: {
          aggregatedInto: existingDump.id,
          reportsCount: newReportsCount,
        },
      };

      return res.status(200).json(response);
    }

    // Create new dump
    const weight = calculateWeight({
      urgency: dumpData.urgency,
      appearance: dumpData.appearance,
      environmentType: dumpData.environmentType,
      reportsCount: 1,
    });

    const newDump = await prisma.dump.create({
      data: {
        ...dumpData,
        weight,
        municipalityId: municipality.id,
      },
      include: { municipality: true },
    });

    // Check if notification should be sent
    if (shouldSendNotification(weight)) {
      await sendNotificationEmail(
        municipality.email,
        newDump.id,
        weight,
        newDump.description
      );
    }

    const response: ApiResponse<typeof newDump> = {
      success: true,
      data: newDump,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating dump:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

export async function getDumps(req: Request, res: Response) {
  try {
    const dumps = await prisma.dump.findMany({
      include: { municipality: true },
      orderBy: { weight: 'desc' },
    });

    const response: ApiResponse<typeof dumps> = {
      success: true,
      data: dumps,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching dumps:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}