import { patientIntake } from './patient-intake';
import { appointmentRequest } from './appointment-request';
import { gymMembership } from './gym-membership';
import { wellnessAssessment } from './wellness-assessment';
import { telehealthConsent } from './telehealth-consent';
import { nutritionLog } from './nutrition-log';
import { personalTrainerIntake } from './personal-trainer-intake';

export const healthTemplates = [
  patientIntake,
  appointmentRequest,
  gymMembership,
  wellnessAssessment,
  telehealthConsent,
  nutritionLog,
  personalTrainerIntake
];
