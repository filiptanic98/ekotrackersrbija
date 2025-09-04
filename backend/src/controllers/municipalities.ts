import { Request, Response } from 'express';
import { CreateMunicipalityInput, ApiResponse } from '@ekotracker/shared';
import prisma from '../services/database';

export async function createMunicipality(req: Request, res: Response) {
  try {
    const municipalityData: CreateMunicipalityInput = req.body;

    if (!municipalityData.name || !municipalityData.email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email'
      });
    }

    const municipality = await prisma.municipality.create({
      data: municipalityData,
    });

    const response: ApiResponse<typeof municipality> = {
      success: true,
      data: municipality,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating municipality:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

export async function getMunicipalities(req: Request, res: Response) {
  try {
    const municipalities = await prisma.municipality.findMany({
      orderBy: { name: 'asc' },
    });

    const response: ApiResponse<typeof municipalities> = {
      success: true,
      data: municipalities,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}