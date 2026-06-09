import { useState, useEffect, useCallback, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDrB5rNbZ1-ZdPpZlvWfeGf5Z_eHmj8k0s",
  authDomain: "lab-access-readiness.firebaseapp.com",
  databaseURL: "https://lab-access-readiness-default-rtdb.firebaseio.com",
  projectId: "lab-access-readiness",
  storageBucket: "lab-access-readiness.firebasestorage.app",
  messagingSenderId: "932035313042",
  appId: "1:932035313042:web:a9fbd0d9557ad665e2154b"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// ─── 60 QUESTIONS ───────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // BIOSAFETY FUNDAMENTALS (12)
  { id:"q01", cat:"Biosafety Fundamentals", diff:"easy", ref:"Section 1.3",
    q:"What WHO Biosafety Level classification applies to the SUZA Seaweed Tissue Culture Laboratory?",
    opts:["BSL-1","BSL-2","BSL-3","BSL-4"], correct:0,
    exp:"The laboratory operates at BSL-1, appropriate for non-pathogenic marine macroalgae and associated microorganisms." },
  { id:"q02", cat:"Biosafety Fundamentals", diff:"easy", ref:"Foreword",
    q:"Which document provides the foundational governance framework for the SUZA Seaweed Tissue Culture Laboratory?",
    opts:["The Biosafety Manual (CB-ZAFIRI-BSM-001)","The SUZA OHS Policy","The AFDP-IFAD Programme Manual","WHO Lab Biosafety Manual (4th Ed.)"], correct:0,
    exp:"The Biosafety Manual (CB-ZAFIRI-BSM-001) is the foundational governance document for all safety and risk management." },
  { id:"q03", cat:"Biosafety Fundamentals", diff:"medium", ref:"Glossary",
    q:"What is the difference between biosafety and biosecurity as defined in the manual?",
    opts:["Biosafety prevents unintentional exposure; biosecurity prevents unauthorized access or misuse","Biosafety covers chemical hazards; biosecurity covers biological hazards","They are interchangeable terms","Biosafety applies to personnel; biosecurity applies to equipment only"], correct:0,
    exp:"Biosafety covers containment principles to prevent unintentional exposure. Biosecurity covers institutional measures to prevent unauthorized access or misuse." },
  { id:"q04", cat:"Biosafety Fundamentals", diff:"easy", ref:"Section 1.3",
    q:"Which marine macroalgae species are the primary cultures maintained in the laboratory?",
    opts:["Kappaphycus alvarezii and Eucheuma denticulatum","Sargassum muticum and Gracilaria verrucosa","Ulva lactuca and Caulerpa taxifolia","Gelidium corneum and Porphyra umbilicalis"], correct:0,
    exp:"The laboratory maintains Kappaphycus alvarezii and Eucheuma denticulatum - non-pathogenic commercial seaweed species." },
  { id:"q05", cat:"Biosafety Fundamentals", diff:"medium", ref:"Table 1.1",
    q:"Which institution holds primary regulatory oversight for the laboratory?",
    opts:["Ministry of Blue Economy and Fisheries (MoBEF)","State University of Zanzibar (SUZA)","Zanzibar Fisheries Research Institute (ZAFIRI)","Coastal Biotech"], correct:0,
    exp:"The Ministry of Blue Economy and Fisheries (MoBEF) holds primary regulatory oversight and programme governance responsibilities." },
  { id:"q06", cat:"Biosafety Fundamentals", diff:"easy", ref:"Section 1.3",
    q:"What is the primary biological risk associated with working in this laboratory?",
    opts:["Contamination of cultures by environmental microorganisms","Infection of personnel by pathogenic organisms","Toxic chemical exposure from reagents","Radiation exposure from equipment"], correct:0,
    exp:"At BSL-1, the primary risk is contamination of non-pathogenic cultures by environmental microorganisms, not personnel infection." },
  { id:"q07", cat:"Biosafety Fundamentals", diff:"hard", ref:"Section 15.4",
    q:"How frequently must the Biosafety Manual be reviewed under standard circumstances?",
    opts:["Annually, with additional reviews triggered by incidents or changes","Every two years regardless of operational changes","Monthly as part of biosafety committee meetings","Only when a major incident occurs"], correct:0,
    exp:"The manual undergoes annual structured review, but revisions may also be triggered by major incidents, significant operational changes, or updated regulatory guidance." },
  { id:"q08", cat:"Biosafety Fundamentals", diff:"medium", ref:"Section 2.1",
    q:"What must be completed before any new personnel are permitted to work independently in the laboratory?",
    opts:["Induction training and biosafety orientation","Only a signature on the access register","Completion of the Foundation Readiness pathway only","A six-month probationary period under direct supervision"], correct:0,
    exp:"All new personnel must complete formal induction training and biosafety orientation before working independently." },
  { id:"q09", cat:"Biosafety Fundamentals", diff:"medium", ref:"Glossary",
    q:"What does the term 'dual-use' refer to in biosecurity?",
    opts:["Knowledge or materials with both legitimate research and potential misuse applications","Equipment that can be used in both wet and dry laboratory settings","Chemicals that serve both as nutrients and sterilants","Personnel authorised to work in both tissue culture and media preparation zones"], correct:0,
    exp:"Dual-use refers to research knowledge, biological materials, or techniques that have legitimate scientific applications but could potentially be misused." },
  { id:"q10", cat:"Biosafety Fundamentals", diff:"easy", ref:"Section 1.1",
    q:"What is the primary programme funding mechanism supporting this laboratory's establishment?",
    opts:["AFDP-IFAD (African Development Programme - International Fund for Agricultural Development)","USAID bilateral grant","European Union Horizon research fund","World Bank aquaculture development loan"], correct:0,
    exp:"The laboratory was established under the AFDP-IFAD programme, which provides the overarching programme governance framework." },
  { id:"q11", cat:"Biosafety Fundamentals", diff:"hard", ref:"Section 2.3",
    q:"In the 5×5 risk matrix, which combination produces a HIGH risk rating?",
    opts:["Likelihood 3 × Consequence 3","Likelihood 1 × Consequence 5","Likelihood 5 × Consequence 1","Likelihood 2 × Consequence 2"], correct:0,
    exp:"A 3×3 product of 9 falls in the HIGH range (8-12) in the 5×5 risk matrix used in this manual." },
  { id:"q12", cat:"Biosafety Fundamentals", diff:"medium", ref:"Section 2.3",
    q:"In the 5×5 risk matrix, what action is required for an EXTREME risk rating?",
    opts:["Immediate action; work must not proceed until controls are implemented","Urgent action; work may continue under enhanced controls with management approval","Controls must be reviewed; incident monitoring required","Acceptable with standard controls; routine monitoring sufficient"], correct:0,
    exp:"EXTREME risk requires immediate action - work must not proceed until adequate control measures are in place." },

  // LABORATORY CONDUCT & GMPP (10)
  { id:"q13", cat:"Laboratory Conduct & GMPP", diff:"easy", ref:"Glossary",
    q:"What does GMPP stand for in the context of this laboratory?",
    opts:["Good Microbiological Practice and Procedure","General Management and Policy Protocol","Guided Microbial Processing Practice","Government-Mandated Pathogen Protocol"], correct:0,
    exp:"GMPP stands for Good Microbiological Practice and Procedure - the foundational code of laboratory conduct for all biological work." },
  { id:"q14", cat:"Laboratory Conduct & GMPP", diff:"easy", ref:"Section 3.1",
    q:"Which of the following is a required GMPP behaviour when entering the laboratory?",
    opts:["Don laboratory coat and gloves before handling any materials","Sign the entry register only if working with chemicals","Announce entry verbally to alert other personnel","Spray all exposed skin with 70% ethanol"], correct:0,
    exp:"Donning a laboratory coat and appropriate gloves before handling any materials is a fundamental GMPP entry requirement." },
  { id:"q15", cat:"Laboratory Conduct & GMPP", diff:"medium", ref:"Section 3.2",
    q:"What is the correct procedure when leaving the laboratory during a work session?",
    opts:["Remove gloves, decontaminate hands, and remove lab coat before exiting","Keep gloves on until fully outside to avoid re-contamination","Remove only gloves; lab coat may be worn in corridors","No specific procedure is required for brief exits"], correct:0,
    exp:"Personnel must remove gloves, decontaminate hands, and remove lab coats before exiting to prevent cross-contamination of common areas." },
  { id:"q16", cat:"Laboratory Conduct & GMPP", diff:"easy", ref:"Section 3.1",
    q:"Which activities are strictly prohibited in the laboratory at all times?",
    opts:["Eating, drinking, smoking, and applying cosmetics","Using mobile phones for non-communication purposes","Working without a supervisor present","Running or moving quickly between benches"], correct:0,
    exp:"Eating, drinking, smoking, and applying cosmetics are strictly prohibited in the laboratory to prevent ingestion of biological or chemical contaminants." },
  { id:"q17", cat:"Laboratory Conduct & GMPP", diff:"medium", ref:"Section 3.3",
    q:"How should a laboratory worker handle a situation where an SOP appears incorrect or outdated?",
    opts:["Report it through the non-conformance system and continue using the current SOP until revised","Follow personal judgement if the SOP seems incorrect","Immediately stop all work until the SOP is corrected","Ask a colleague for their preferred method instead"], correct:0,
    exp:"Apparent SOP discrepancies must be reported through the non-conformance system. Personnel continue following the current SOP until it is formally revised." },
  { id:"q18", cat:"Laboratory Conduct & GMPP", diff:"medium", ref:"Section 3.2",
    q:"What is the minimum hand-washing duration required after removing gloves?",
    opts:["20 seconds with soap and water","5 seconds with ethanol only","60 seconds with chlorhexidine","10 seconds - duration is not specified"], correct:0,
    exp:"A minimum of 20 seconds of hand-washing with soap and water is required after glove removal as part of GMPP." },
  { id:"q19", cat:"Laboratory Conduct & GMPP", diff:"easy", ref:"Section 3.1",
    q:"Personal protective equipment (PPE) worn inside the laboratory must be:",
    opts:["Removed and stored inside the laboratory before exiting","Worn throughout the facility including offices and common areas","Shared between personnel to reduce costs","Discarded daily regardless of contamination status"], correct:0,
    exp:"PPE is contaminated during laboratory work and must be removed and stored inside the laboratory before exiting to common areas." },
  { id:"q20", cat:"Laboratory Conduct & GMPP", diff:"hard", ref:"Section 3.4",
    q:"What action is required if a GMPP violation is observed being committed by a supervisor?",
    opts:["Report it through the laboratory's incident reporting system to the Biosafety Officer","Ignore it if the supervisor has seniority","Correct the supervisor verbally and document it personally","No action - supervisors are exempt from routine GMPP requirements"], correct:0,
    exp:"All personnel, regardless of seniority, are subject to GMPP. Observed violations must be reported through the incident reporting system to the Biosafety Officer." },
  { id:"q21", cat:"Laboratory Conduct & GMPP", diff:"medium", ref:"Section 3.2",
    q:"Which statement about mobile phone use in the laboratory is correct?",
    opts:["Phones may be used for work-related communications only and must not contact surfaces","Phones are completely prohibited in all laboratory areas","Phones may be used freely as long as gloves are worn","Personal phones are permitted if placed in a sealed bag"], correct:0,
    exp:"Mobile phone use is restricted to work-related communications. Phones must not contact contaminated surfaces and hands must be cleaned before and after use." },
  { id:"q22", cat:"Laboratory Conduct & GMPP", diff:"easy", ref:"Section 3.1",
    q:"Visitors to the laboratory must:",
    opts:["Be escorted by an authorised personnel member and wear appropriate PPE","Sign in only - no further requirements apply","Complete full induction training before any visit","Be restricted to observation areas and never enter the main lab"], correct:0,
    exp:"All visitors must be accompanied by an authorised laboratory member and must wear appropriate PPE for the areas visited." },

  // PPE & PERSONAL PROTECTION (8)
  { id:"q23", cat:"PPE & Personal Protection", diff:"easy", ref:"Section 4.1",
    q:"What is the minimum PPE requirement for all personnel working at laboratory benches?",
    opts:["Laboratory coat, nitrile gloves, and closed-toe footwear","Laboratory coat only - gloves required for chemical work only","Gloves and eye protection - coats optional","Full-body coverall for all bench activities"], correct:0,
    exp:"The minimum bench PPE standard is a laboratory coat, nitrile gloves, and closed-toe footwear at all times." },
  { id:"q24", cat:"PPE & Personal Protection", diff:"medium", ref:"Section 4.2",
    q:"When is eye protection mandatory in addition to standard bench PPE?",
    opts:["When working with chemicals, autoclaving, or any procedure with splash risk","Only when working with concentrated acids","Only during autoclave unloading","Never - eye protection is recommended but not mandatory"], correct:0,
    exp:"Eye protection is mandatory when working with chemicals, operating autoclaves, or performing any procedure with a splash or aerosol risk." },
  { id:"q25", cat:"PPE & Personal Protection", diff:"medium", ref:"Section 4.3",
    q:"What should a worker do immediately after a glove puncture or tear during culture work?",
    opts:["Stop work immediately, remove gloves, wash hands for 20 seconds, and report the incident","Continue working until the current procedure step is complete, then change gloves","Replace only the damaged glove and continue","Apply adhesive tape over the puncture and continue if contamination seems unlikely"], correct:0,
    exp:"A glove breach requires immediate work stoppage, removal of both gloves, thorough handwashing, and formal incident reporting." },
  { id:"q26", cat:"PPE & Personal Protection", diff:"easy", ref:"Section 4.1",
    q:"Laboratory coats used in this facility must be:",
    opts:["Full-length, long-sleeved, and fastened at all times during work","Short-sleeved to reduce contamination of cuffs","Shared between shifts to minimise laundry costs","Taken home for laundering by the individual wearer"], correct:0,
    exp:"Laboratory coats must be full-length, long-sleeved, and fully fastened during work. They are laundered on-site and must not be taken home." },
  { id:"q27", cat:"PPE & Personal Protection", diff:"hard", ref:"Section 4.4",
    q:"Which glove material is specified as the standard for routine tissue culture work in this laboratory?",
    opts:["Nitrile (powder-free)","Latex (powdered)","Vinyl","Neoprene"], correct:0,
    exp:"Powder-free nitrile gloves are the standard for routine tissue culture work, eliminating latex allergy risk and powder contamination." },
  { id:"q28", cat:"PPE & Personal Protection", diff:"medium", ref:"Section 4.2",
    q:"When handling liquid nitrogen for cryopreservation, which additional PPE is required beyond standard bench PPE?",
    opts:["Cryogenic gloves, face shield, and closed shoes - no synthetic fabrics near LN₂","Standard nitrile gloves are sufficient if work is brief","Only a face shield - hand protection is unnecessary for small volumes","Full chemical protective suit"], correct:0,
    exp:"Cryogenic gloves and a full face shield are mandatory for liquid nitrogen handling. Synthetic fabrics that can trap cold liquid near skin are also prohibited." },
  { id:"q29", cat:"PPE & Personal Protection", diff:"easy", ref:"Section 4.5",
    q:"Contaminated PPE that cannot be reused must be disposed of in:",
    opts:["The designated biohazard waste stream (yellow bag or rigid container as appropriate)","The general waste bin if visually clean","The chemical waste container","The sharps container regardless of contamination type"], correct:0,
    exp:"Contaminated single-use PPE is classified as biohazard waste and must enter the appropriate biohazard waste stream." },
  { id:"q30", cat:"PPE & Personal Protection", diff:"medium", ref:"Section 4.3",
    q:"A laboratory worker develops a skin rash after switching to a new glove brand. The correct first action is:",
    opts:["Report to the Biosafety Officer and occupational health, and cease use of that glove brand","Continue using the gloves and monitor the rash for one week","Apply barrier cream before donning and continue","Wash hands more frequently and continue work"], correct:0,
    exp:"Any suspected occupational allergic reaction must be reported immediately to the Biosafety Officer and occupational health. The implicated product must be withdrawn pending investigation." },

  // RISK MANAGEMENT (6)
  { id:"q31", cat:"Risk Management", diff:"medium", ref:"Section 2.2",
    q:"What is a hazard as defined in the laboratory risk framework?",
    opts:["A source with the potential to cause harm","The likelihood that harm will occur","The consequence of an identified exposure","A documented control measure"], correct:0,
    exp:"A hazard is a source, situation, or act with potential to cause harm. Risk is the combination of the likelihood and consequence of that harm occurring." },
  { id:"q32", cat:"Risk Management", diff:"medium", ref:"Section 2.4",
    q:"In the hierarchy of controls, which measure provides the highest level of protection?",
    opts:["Elimination of the hazard","Engineering controls (e.g. laminar flow cabinet)","Administrative controls (e.g. SOPs and training)","PPE"], correct:0,
    exp:"Elimination removes the hazard entirely and provides the highest protection. PPE is the last line of defence and least reliable control measure." },
  { id:"q33", cat:"Risk Management", diff:"hard", ref:"Section 2.3",
    q:"A routine subculture procedure is assessed at Likelihood 2, Consequence 3 on the 5×5 matrix. What risk rating does this produce?",
    opts:["MEDIUM (score 6)","LOW (score 4)","HIGH (score 8)","EXTREME (score 10)"], correct:0,
    exp:"2 × 3 = 6, which falls in the MEDIUM range (5-8 in many 5×5 frameworks as used in this manual). MEDIUM risk requires specific controls but work may proceed." },
  { id:"q34", cat:"Risk Management", diff:"medium", ref:"Section 2.5",
    q:"Who is responsible for conducting and documenting formal risk assessments for new procedures?",
    opts:["The Laboratory Manager or designated Biosafety Officer","The individual researcher who will perform the procedure","Any trained laboratory member","The Ministry of Blue Economy and Fisheries inspector"], correct:0,
    exp:"Formal risk assessments for new or modified procedures must be conducted and documented by the Laboratory Manager or designated Biosafety Officer." },
  { id:"q35", cat:"Risk Management", diff:"easy", ref:"Section 2.1",
    q:"What does a risk assessment determine?",
    opts:["The likelihood and consequence of identified hazards and the controls needed","Only the type of PPE required for a task","The cost of implementing safety measures","Whether a procedure should be approved by the funder"], correct:0,
    exp:"A risk assessment systematically identifies hazards, evaluates the likelihood and consequence of harm, and determines the controls needed to reduce risk to an acceptable level." },
  { id:"q36", cat:"Risk Management", diff:"hard", ref:"Section 2.6",
    q:"Under what circumstance should a previously approved risk assessment be reviewed before its scheduled annual date?",
    opts:["After any incident, near-miss, or significant change to the procedure or environment","Only if a regulator requests a review","After three consecutive months without incidents","When a new staff member joins the team"], correct:0,
    exp:"Risk assessments must be reviewed following any incident, near-miss, or significant procedural or environmental change - not just on an annual schedule." },

  // CHEMICAL SAFETY (7)
  { id:"q37", cat:"Chemical Safety", diff:"easy", ref:"Section 2.1.2",
    q:"What document must be maintained and accessible for all chemicals in the laboratory?",
    opts:["Safety Data Sheet (SDS)","Chemical Risk Assessment Form","Standard Operating Procedure (SOP)","Material Transfer Agreement (MTA)"], correct:0,
    exp:"Safety Data Sheets (SDS) for all chemicals in use must be maintained and accessible within the laboratory at all times." },
  { id:"q38", cat:"Chemical Safety", diff:"medium", ref:"Section 5.2",
    q:"What is the correct response to a liquid chemical spill on a bench surface?",
    opts:["Alert others, don appropriate PPE, absorb with spill kit materials, neutralise if required, dispose as chemical waste","Wipe up immediately with paper towels without PPE if the volume is small","Pour water over the spill to dilute it before absorbing","Evacuate the entire building immediately for any chemical spill"], correct:0,
    exp:"A bench spill requires alerting nearby personnel, donning correct PPE, using spill kit materials to absorb, neutralising acid/base if required, and disposing as chemical waste." },
  { id:"q39", cat:"Chemical Safety", diff:"medium", ref:"Section 5.3",
    q:"How must incompatible chemicals be stored?",
    opts:["Physically separated in designated cabinets - acids and bases must never share a cabinet","Together if volumes are small (under 1 litre each)","In the same cabinet with a physical barrier between them","Under the bench in labelled containers regardless of compatibility"], correct:0,
    exp:"Incompatible chemicals - especially acids and bases - must be physically separated in designated cabinets to prevent dangerous reactions if a container fails." },
  { id:"q40", cat:"Chemical Safety", diff:"easy", ref:"Section 5.1",
    q:"When diluting concentrated sulphuric acid, the correct procedure is:",
    opts:["Always add acid to water - never add water to concentrated acid","Add water to acid slowly while stirring","The order does not matter if both are added slowly","Both liquids should be added simultaneously to a third container"], correct:0,
    exp:"The golden rule: always add acid to water. Adding water to concentrated acid causes violent exothermic reactions and can cause eruption of boiling acid." },
  { id:"q41", cat:"Chemical Safety", diff:"medium", ref:"Section 5.4",
    q:"Chemical waste segregation in this laboratory requires:",
    opts:["Separation by hazard class (acids, bases, solvents, etc.) in labelled, sealed containers","Mixing all liquid chemical waste in one container for efficiency","Pouring small volumes of dilute chemicals down the drain","Solid and liquid chemical waste may be combined if total volume is low"], correct:0,
    exp:"Chemical waste must be segregated by hazard class in clearly labelled, sealed containers. Drain disposal of chemical waste is prohibited without specific authorisation." },
  { id:"q42", cat:"Chemical Safety", diff:"hard", ref:"Section 5.5",
    q:"A worker notices a chemical label is damaged and illegible. The correct action is:",
    opts:["Isolate the container, do not use it, and report to the Laboratory Manager for identification","Apply a new general-purpose label with today's date and continue","Smell or visually inspect to try to identify the substance","Dispose of it immediately in the chemical waste container"], correct:0,
    exp:"An illegible label renders a chemical unidentifiable and therefore unusable. It must be isolated, reported, and formally identified before any use or disposal." },
  { id:"q43", cat:"Chemical Safety", diff:"medium", ref:"Section 5.6",
    q:"What is the maximum volume of flammable solvents permitted to be stored at a single bench work area at one time?",
    opts:["The minimum quantity required for the immediate task - no bulk storage at benches","Up to 5 litres in an approved flammable storage cabinet under the bench","No limit if in original sealed containers","Up to 1 litre in any container type"], correct:0,
    exp:"Only the minimum quantity needed for the immediate task may be kept at a bench. Bulk storage of flammable solvents must be in approved flammable storage cabinets away from ignition sources." },

  // WASTE MANAGEMENT (6)
  { id:"q44", cat:"Waste Management", diff:"easy", ref:"Section 6.1",
    q:"What does CCP stand for in the laboratory quality management system?",
    opts:["Contamination Control Point","Chemical Containment Protocol","Critical Culture Parameter","Corrective Control Procedure"], correct:0,
    exp:"CCP stands for Contamination Control Point - a critical step in the tissue culture workflow where targeted controls are applied to reduce contamination risk." },
  { id:"q45", cat:"Waste Management", diff:"medium", ref:"Section 6.2",
    q:"How must solid biological waste (contaminated agar, culture vessels) be treated before disposal?",
    opts:["Autoclaved at 121°C for the validated cycle time, then disposed of as general laboratory waste","Placed directly in yellow biohazard bags without pre-treatment","Incinerated on-site in the laboratory incinerator","Soaked in 10% bleach for one hour, then drain-disposed"], correct:0,
    exp:"Solid biological waste must be autoclaved using the validated sterilisation cycle (121°C) before disposal as general laboratory waste." },
  { id:"q46", cat:"Waste Management", diff:"medium", ref:"Section 6.3",
    q:"Liquid biological waste from culture vessels must be decontaminated by:",
    opts:["Adding sodium hypochlorite to a final concentration of at least 1% and holding for the validated contact time","Boiling for 10 minutes in the vessel","Autoclaving in open containers","Dilution to below detectable levels before drain disposal"], correct:0,
    exp:"Liquid biological waste is decontaminated by adding sodium hypochlorite (bleach) to a minimum final concentration of 1% and maintaining contact for the validated time before drain disposal." },
  { id:"q47", cat:"Waste Management", diff:"easy", ref:"Section 6.4",
    q:"Sharps (needles, scalpel blades, broken glass) must be disposed of in:",
    opts:["A rigid puncture-resistant sharps container - never in flexible bags","Yellow biohazard bags if visually contaminated","The general waste bin if uncontaminated","A separate bin from other laboratory waste but flexible bags are acceptable"], correct:0,
    exp:"All sharps must be disposed of in rigid, puncture-resistant sharps containers regardless of contamination status. Flexible bags pose puncture injury risk." },
  { id:"q48", cat:"Waste Management", diff:"hard", ref:"Section 6.5",
    q:"How often must autoclave efficacy for waste decontamination be validated using biological indicators?",
    opts:["At minimum monthly, and after any autoclave repair or parameter change","Weekly, using chemical indicators only","Annually during the laboratory safety audit","Biological indicator testing is optional if temperature charts are reviewed daily"], correct:0,
    exp:"Autoclave efficacy for waste decontamination must be validated with biological indicators (Geobacillus stearothermophilus spores) at minimum monthly, and after any repair or parameter change." },
  { id:"q49", cat:"Waste Management", diff:"medium", ref:"Section 6.6",
    q:"Which waste stream is used for PPE such as used gloves and contaminated wipes?",
    opts:["Biohazard waste (yellow bag) - infectious or potentially infectious soft waste","General waste if the items appear uncontaminated","Chemical waste if gloves contacted chemicals","Sharps container - contaminated PPE is treated as sharps-risk"], correct:0,
    exp:"Used gloves, wipes, and other potentially contaminated soft PPE waste goes into the biohazard (yellow bag) waste stream." },

  // INCIDENT REPORTING (5)
  { id:"q50", cat:"Incident Reporting", diff:"medium", ref:"Glossary",
    q:"What is a non-conformance as defined in this manual?",
    opts:["A failure to meet a defined procedural, quality, or safety requirement requiring documentation and corrective action","An occurrence resulting in personnel injury only","Any deviation from the original research plan","A disagreement between laboratory staff members"], correct:0,
    exp:"A non-conformance is a failure to meet any defined procedural, quality, or safety requirement. It requires formal documentation and corrective action regardless of whether harm occurred." },
  { id:"q51", cat:"Incident Reporting", diff:"easy", ref:"Section 7.1",
    q:"Who must be notified immediately (within one hour) of any laboratory accident involving personnel injury?",
    opts:["The Laboratory Manager or Biosafety Officer","Only the Ministry of Blue Economy and Fisheries","The individual's next of kin first","No immediate notification is required - complete the form within 24 hours"], correct:0,
    exp:"Any laboratory accident involving personnel injury requires immediate notification of the Laboratory Manager or Biosafety Officer within one hour." },
  { id:"q52", cat:"Incident Reporting", diff:"medium", ref:"Section 7.2",
    q:"What is a near-miss?",
    opts:["An event that could have caused harm but did not - still reportable","Only events that result in injury","Any non-conformance involving chemicals","A contamination event that was caught before it spread"], correct:0,
    exp:"A near-miss is an event that had the potential to cause harm or non-conformance but did not - it is fully reportable and subject to investigation." },
  { id:"q53", cat:"Incident Reporting", diff:"hard", ref:"Section 7.3",
    q:"What does CAPA stand for, and what does it require?",
    opts:["Corrective and Preventive Action - root cause analysis, remedial actions, and systemic prevention","Chemical and Physical Assessment - evaluation of laboratory hazards","Culture Assessment and Propagation Analysis - culture performance monitoring","Compliance Audit and Protocol Adjustment - quarterly review process"], correct:0,
    exp:"CAPA stands for Corrective and Preventive Action - a documented response to a non-conformance comprising root cause analysis, immediate remedial actions, and long-term systemic prevention." },
  { id:"q54", cat:"Incident Reporting", diff:"medium", ref:"Section 7.4",
    q:"Within what timeframe must a completed incident report form be submitted after an incident?",
    opts:["Within 24 hours of the incident","Within 7 days","At the next monthly biosafety committee meeting","Only if the incident results in lost work time"], correct:0,
    exp:"A completed incident report must be submitted within 24 hours. Delayed reporting is itself a non-conformance." },

  // GOVERNANCE & COMPLIANCE (6)
  { id:"q55", cat:"Governance & Compliance", diff:"medium", ref:"Glossary",
    q:"What does CAPA stand for and what does it require?",
    opts:["Corrective and Preventive Action - root cause analysis, remedial actions, and systemic prevention","Chemical and Physical Assessment","Culture Assessment and Propagation Analysis","Compliance Audit and Protocol Adjustment"], correct:0,
    exp:"CAPA (Corrective and Preventive Action) requires documenting the root cause, implementing immediate remedial actions, and establishing systemic measures to prevent recurrence." },
  { id:"q56", cat:"Governance & Compliance", diff:"hard", ref:"Section 13.3",
    q:"What is the maximum acceptable contamination rate for culture batches within a one-month period before a formal process review is triggered?",
    opts:["10%","5%","15%","20%"], correct:0,
    exp:"A contamination rate exceeding 10% of initiation batches within any one-month period automatically triggers a formal process review." },
  { id:"q57", cat:"Governance & Compliance", diff:"medium", ref:"Section 15.2",
    q:"Who is authorised to approve changes to validated SOPs?",
    opts:["Only the Laboratory Manager or Biosafety Officer - not individual bench personnel","Any experienced staff member who identifies the need","Bench personnel for minor edits, management for major revisions","The IFAD programme coordinator"], correct:0,
    exp:"SOP changes may only be approved by the Laboratory Manager or Biosafety Officer. Individual personnel may propose changes through the non-conformance system but may not implement them unilaterally." },
  { id:"q58", cat:"Governance & Compliance", diff:"easy", ref:"Section 15.1",
    q:"What does SOP stand for?",
    opts:["Standard Operating Procedure","Safety and Occupational Procedure","Standard Output Protocol","Systematic Observation Practice"], correct:0,
    exp:"SOP stands for Standard Operating Procedure - a documented, step-by-step instruction for performing a defined task consistently and safely." },
  { id:"q59", cat:"Governance & Compliance", diff:"medium", ref:"Section 15.3",
    q:"How must SOP training be documented?",
    opts:["Signed training records retained in each personnel member's training file","Verbal confirmation to the supervisor only","Email confirmation to the Laboratory Manager","A collective sign-off sheet at team meetings"], correct:0,
    exp:"SOP training must be documented with signed training records, which are retained in each individual's training file for audit purposes." },
  { id:"q60", cat:"Governance & Compliance", diff:"hard", ref:"Section 15.5",
    q:"Which of the following correctly describes the document control requirement for superseded SOPs?",
    opts:["They must be archived with a clear superseded date and retained for a minimum of five years","They may be destroyed immediately upon replacement","Only the current version needs to be retained","Superseded SOPs should be kept on the bench for reference during transition"], correct:0,
    exp:"Superseded SOPs must be clearly marked as superseded, removed from circulation, and archived for a minimum of five years to support audit traceability." },
];

const PATHWAYS = [
  { id:"foundation", name:"Foundation Readiness", mandatory:true,
    desc:"Core biosafety, laboratory conduct, PPE, GMPP, waste management, incident reporting and emergency response as defined in CB-ZAFIRI-BSM-001.",
    questions:20, time:40, pass:80,
    cats:["Biosafety Fundamentals","Laboratory Conduct & GMPP","PPE & Personal Protection","Risk Management","Chemical Safety","Waste Management","Incident Reporting","Governance & Compliance"] },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
function fmtTimer(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
function hashPw(pw) {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = ((h << 5) - h + pw.charCodeAt(i)) | 0;
  return h.toString(36);
}

// ─── FIREBASE STORAGE ────────────────────────────────────────────────────────
const K = {
  users: "lab_users",
  attempts: "lab_attempts",
  pathways: "lab_user_pathways",
};

async function sGet(key) {
  try {
    const snapshot = await get(ref(db, key));
    return snapshot.exists() ? snapshot.val() : null;
  } catch { return null; }
}

async function sSet(key, val) {
  try { await set(ref(db, key), val); } catch (e) { console.error("Firebase write error:", e); }
}

// Pre-seed admin accounts if not present
const SEED_ADMINS = [
  { id: "u_admin_danford", email: "danford.mkunda@cbiio.com", password: "danfordmkunda2026", name: "Danford Mkunda" },
  { id: "u_admin_lavine",  email: "lavine.irvine@cbiio.com",  password: "lavineirvine2026",  name: "Lavine Irvine" },
  { id: "u_admin_steven",  email: "steven.sillah@cbiio.com",  password: "stevensillah2026",  name: "Steven Sillah" },
];
async function ensureAdminSeeded() {
  let users = await sGet(K.users) || {};
  let changed = false;
  for (const a of SEED_ADMINS) {
    if (!users[a.id]) {
      users[a.id] = { id: a.id, email: a.email, pwHash: hashPw(a.password), name: a.name, institution: "Coastal Biotech", position: "Administrator", department: "Administration", role: "admin", status: "approved", createdAt: new Date().toISOString() };
      changed = true;
    }
  }
  if (changed) await sSet(K.users, users);
  return users;
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("loading");
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState({});
  const [attempts, setAttempts] = useState([]);
  const [userPathways, setUserPathways] = useState({});
  const [quizData, setQuizData] = useState(null);

  const reload = useCallback(async () => {
    const [u, a, up] = await Promise.all([sGet(K.users), sGet(K.attempts), sGet(K.pathways)]);
    setUsers(u || {});
    setAttempts(a ? Object.values(a) : []);
    setUserPathways(up || {});
  }, []);

  useEffect(() => {
    ensureAdminSeeded().then(u => {
      setUsers(u || {});
      return Promise.all([sGet(K.attempts), sGet(K.pathways)]);
    }).then(([a, up]) => {
      setAttempts(a ? Object.values(a) : []);
      setUserPathways(up || {});
      setPage("login");
    });
  }, []);

  const saveUsers = async (u) => { setUsers(u); await sSet(K.users, u); };
  const saveAttempts = async (a) => {
    setAttempts(a);
    const obj = {};
    a.forEach(item => { obj[item.id] = item; });
    await sSet(K.attempts, obj);
  };
  const saveUP = async (up) => { setUserPathways(up); await sSet(K.pathways, up); };

  const handleLogin = async (email, pw) => {
    const freshUsers = await sGet(K.users) || users;
    setUsers(freshUsers);
    const u = Object.values(freshUsers).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!u) return "No account found with that email.";
    if (u.pwHash !== hashPw(pw)) return "Incorrect password.";
    if (u.status === "pending_approval") return "Your account is awaiting administrator approval.";
    if (u.status === "rejected") return "Your application has been rejected. Contact the laboratory administrator.";
    if (u.status === "suspended") return "Your account has been suspended. Contact the laboratory administrator.";
    setMe(u);
    setPage(u.role === "admin" ? "admin_dash" : "dashboard");
    return null;
  };

  const handleRegister = async (form) => {
    await reload();
    const existing = Object.values(users).find(u => u.email.toLowerCase() === form.email.toLowerCase());
    if (existing) return "An account with this email already exists.";
    const id = "u_" + Date.now();
    const newUser = {
      id, email: form.email, pwHash: hashPw(form.password),
      name: form.name, institution: form.institution,
      position: form.position, department: form.department || "",
      role: "candidate",
      status: "pending_approval",
      createdAt: new Date().toISOString(),
    };
    const newUsers = { ...users, [id]: newUser };
    await saveUsers(newUsers);
    return null;
  };

  const logout = () => { setMe(null); setPage("login"); };

  const approveUser = async (uid) => {
    const u = { ...users[uid], status: "approved" };
    const newUsers = { ...users, [uid]: u };
    await saveUsers(newUsers);
    const key = `${uid}_foundation`;
    if (!userPathways[key]) {
      const newUP = { ...userPathways, [key]: { userId: uid, pathwayId: "foundation", status: "assigned", assignedAt: new Date().toISOString(), bestScore: null, attempts: 0 } };
      await saveUP(newUP);
    }
    await reload();
  };

  const rejectUser = async (uid) => {
    const newUsers = { ...users, [uid]: { ...users[uid], status: "rejected" } };
    await saveUsers(newUsers);
    await reload();
  };

  const startQuiz = (pathwayId) => {
    const pw = PATHWAYS.find(p => p.id === pathwayId);
    const pool = shuffle(ALL_QUESTIONS).slice(0, pw.questions);
    const qs = pool.map(q => ({
      ...q,
      shuffledOpts: shuffle(q.opts.map((o, i) => ({ text: o, origIdx: i }))),
    }));
    setQuizData({ pathwayId, pw, qs, idx: 0, answers: {}, timer: pw.time * 60, done: false });
    setPage("quiz");
  };

  const submitQuiz = useCallback(async (answers, qs, pathwayId) => {
    if (!me) return;
    let correct = 0;
    const detail = qs.map(q => {
      const chosen = answers[q.id];
      const isCorrect = chosen === q.correct;
      if (isCorrect) correct++;
      return { qid: q.id, cat: q.cat, chosen, isCorrect, correct: q.correct };
    });
    const score = Math.round((correct / qs.length) * 100);
    const passed = score >= 80;
    const attempt = {
      id: "a_" + Date.now(),
      userId: me.id, pathwayId,
      score, correct, total: qs.length, passed,
      detail,
      completedAt: new Date().toISOString(),
    };
    const newAttempts = [...attempts, attempt];
    await saveAttempts(newAttempts);

    const key = `${me.id}_${pathwayId}`;
    const existing = userPathways[key];
    const newUP = {
      ...userPathways,
      [key]: {
        ...(existing || {}),
        userId: me.id, pathwayId,
        status: passed ? "achieved" : "prep_recommended",
        bestScore: Math.max(existing?.bestScore || 0, score),
        attempts: (existing?.attempts || 0) + 1,
        lastAttemptAt: new Date().toISOString(),
      }
    };
    await saveUP(newUP);
    setAttempts(newAttempts);
    setUserPathways(newUP);

    setQuizData(qd => ({ ...qd, result: attempt, done: true }));
    setPage("result");
  }, [me, attempts, userPathways]);

  if (page === "loading") return <Loading />;
  if (page === "login") return <Login onLogin={handleLogin} onRegister={() => setPage("register")} />;
  if (page === "register") return <Register onRegister={handleRegister} onBack={() => setPage("login")} />;
  if (!me) return <Login onLogin={handleLogin} onRegister={() => setPage("register")} />;

  if (page === "quiz" && quizData) return (
    <Quiz quizData={quizData} setQuizData={setQuizData} onSubmit={submitQuiz} onExit={() => setPage("dashboard")} />
  );
  if (page === "result" && quizData?.result) return (
    <Result result={quizData.result} pw={quizData.pw} onBack={() => setPage("dashboard")} onRetake={() => startQuiz(quizData.pathwayId)} />
  );

  if (me.role === "admin") return (
    <AdminLayout me={me} onLogout={logout} page={page} setPage={setPage}
      users={users} attempts={attempts} userPathways={userPathways}
      onApprove={approveUser} onReject={rejectUser} reload={reload} />
  );

  return (
    <CandidateLayout me={me} onLogout={logout} page={page} setPage={setPage}
      attempts={attempts.filter(a => a.userId === me.id)}
      userPathways={userPathways}
      onStart={startQuiz} />
  );
}

// ─── LOADING ────────────────────────────────────────────────────────────────
function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, color: "var(--color-text-secondary)", fontSize: 14 }}>
      <i className="ti ti-loader" style={{ fontSize: 24, marginRight: 10 }} aria-hidden="true" />
      Loading platform…
    </div>
  );
}

// ─── TOPBAR ─────────────────────────────────────────────────────────────────
function Topbar({ me, onLogout }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "0 16px", height: 44, borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500 }}>
        <i className="ti ti-flask" style={{ fontSize: 16, color: "#0F6E56" }} aria-hidden="true" />
        Lab Access Readiness
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, border: "0.5px solid var(--color-border-tertiary)", color: "var(--color-text-secondary)" }}>
          {me.role === "admin" ? "Administrator" : "Candidate"}
        </span>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "#0F6E56" }}>
          {initials(me.name)}
        </div>
        <button onClick={onLogout} style={{ fontSize: 11, padding: "4px 10px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, cursor: "pointer", background: "transparent", color: "var(--color-text-secondary)" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────
function Sidebar({ items, active, onNav }) {
  return (
    <div style={{ width: 170, borderRight: "0.5px solid var(--color-border-tertiary)", padding: "12px 0", flexShrink: 0, background: "var(--color-background-primary)" }}>
      {items.map(({ id, label, icon, section }) => section
        ? <div key={id} style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "10px 14px 4px" }}>{label}</div>
        : <div key={id} onClick={() => onNav(id)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer", color: active === id ? "#0F6E56" : "var(--color-text-secondary)", background: active === id ? "#E1F5EE" : "transparent", fontWeight: active === id ? 500 : 400 }}>
            <i className={`ti ${icon}`} style={{ fontSize: 16 }} aria-hidden="true" />{label}
          </div>
      )}
    </div>
  );
}

// ─── CANDIDATE LAYOUT ───────────────────────────────────────────────────────
function CandidateLayout({ me, onLogout, page, setPage, attempts, userPathways, onStart }) {
  const navItems = [
    { id: "s1", label: "Candidate", section: true },
    { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
    { id: "pathways", label: "My pathways", icon: "ti-book-2" },
    { id: "history", label: "My history", icon: "ti-history" },
  ];
  const myUP = Object.values(userPathways).filter(up => up.userId === me.id);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 600, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "var(--color-background-primary)" }}>
      <Topbar me={me} onLogout={onLogout} />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar items={navItems} active={page} onNav={setPage} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          {page === "dashboard" && <CandidateDash me={me} myUP={myUP} attempts={attempts} onNav={setPage} />}
          {page === "pathways" && <CandidatePathways myUP={myUP} attempts={attempts} onStart={onStart} />}
          {page === "history" && <CandidateHistory attempts={attempts} />}
        </div>
      </div>
    </div>
  );
}

function CandidateDash({ me, myUP, attempts, onNav }) {
  const achieved = myUP.filter(up => up.status === "achieved").length;
  const scores = attempts.filter(a => a.score != null).map(a => a.score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : null;
  const firstName = me.name.split(" ")[0];
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Welcome, {firstName}</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>Your laboratory readiness overview</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { n: myUP.length, l: "Pathways assigned" },
          { n: achieved, l: "Readiness achieved", c: "#0F6E56" },
          { n: attempts.length, l: "Total attempts" },
          { n: avg != null ? avg + "%" : "-", l: "Average score", c: avg != null ? (avg >= 80 ? "#0F6E56" : "#BA7517") : undefined },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: s.c || "var(--color-text-primary)" }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <i className="ti ti-book-2" style={{ color: "#1D9E75", fontSize: 15 }} aria-hidden="true" />My pathways
          </div>
          {myUP.length === 0
            ? <div style={{ textAlign: "center", padding: "24px 0", color: "var(--color-text-tertiary)", fontSize: 12 }}>No pathways assigned yet. Wait for admin approval.</div>
            : myUP.map(up => (
              <div key={up.pathwayId} style={{ display: "flex", alignItems: "center", padding: "8px 10px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{PATHWAYS.find(p => p.id === up.pathwayId)?.name}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{up.attempts} attempt{up.attempts !== 1 ? "s" : ""}{up.bestScore != null ? ` · Best: ${up.bestScore}%` : ""}</div>
                </div>
                <UPBadge status={up.status} />
              </div>
            ))
          }
          <button onClick={() => onNav("pathways")} style={{ marginTop: 10, fontSize: 11, padding: "4px 10px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, cursor: "pointer", background: "transparent", color: "var(--color-text-secondary)" }}>
            View all <i className="ti ti-arrow-right" style={{ fontSize: 11 }} aria-hidden="true" />
          </button>
        </div>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <i className="ti ti-trending-up" style={{ color: "#1D9E75", fontSize: 15 }} aria-hidden="true" />Recent attempts
          </div>
          {attempts.length === 0
            ? <div style={{ textAlign: "center", padding: "24px 0", color: "var(--color-text-tertiary)", fontSize: 12 }}>No attempts yet. Start a pathway to begin.</div>
            : [...attempts].reverse().slice(0, 4).map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", padding: "7px 10px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{PATHWAYS.find(p => p.id === a.pathwayId)?.name}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{new Date(a.completedAt).toLocaleDateString()}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: a.score >= 80 ? "#0F6E56" : a.score >= 65 ? "#BA7517" : "#993C1D" }}>{a.score}%</div>
              </div>
            ))
          }
        </div>
      </div>
      <div style={{ background: "#E1F5EE", border: "0.5px solid #9FE1CB", borderRadius: "var(--border-radius-md)", padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16 }}>
        <i className="ti ti-trophy" style={{ color: "#0F6E56", fontSize: 16, marginTop: 1, flexShrink: 0 }} aria-hidden="true" />
        <div style={{ fontSize: 12, color: "#085041", lineHeight: 1.55 }}>
          <strong>Readiness score required: 80%</strong><br />
          Scoring 80% or above grants Readiness Achieved status. Below 80% is recorded as Additional Preparation Recommended.
        </div>
      </div>
    </div>
  );
}

function CandidatePathways({ myUP, attempts, onStart }) {
  if (myUP.length === 0) return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Readiness pathways</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>Complete each pathway to demonstrate laboratory readiness</div>
      </div>
      <div style={{ textAlign: "center", padding: "48px 20px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", color: "var(--color-text-tertiary)" }}>
        <i className="ti ti-lock" style={{ fontSize: 32, display: "block", marginBottom: 8 }} aria-hidden="true" />
        <div style={{ fontSize: 14, fontWeight: 500 }}>No pathways assigned</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Your account is pending approval. An administrator will assign pathways once approved.</div>
      </div>
    </div>
  );
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Readiness pathways</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>Complete each pathway to demonstrate laboratory readiness</div>
      </div>
      {PATHWAYS.map(pw => {
        const up = myUP.find(u => u.pathwayId === pw.id);
        if (!up) return null;
        const myAttempts = attempts.filter(a => a.pathwayId === pw.id);
        return (
          <div key={pw.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: up.status === "achieved" ? "#E1F5EE" : "#E6F1FB", color: up.status === "achieved" ? "#0F6E56" : "#185FA5", fontSize: 16 }}>
                <i className={`ti ${up.status === "achieved" ? "ti-circle-check" : "ti-book-2"}`} aria-hidden="true" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{pw.name}</span>
                  {pw.mandatory && <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: "#FCEBEB", color: "#A32D2D", fontWeight: 500 }}>Mandatory</span>}
                  <UPBadge status={up.status} />
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>{pw.desc}</div>
                <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 10 }}>
                  <span>{pw.questions} questions</span>
                  <span>{pw.time} min limit</span>
                  <span>Pass: {pw.pass}%</span>
                  {up.attempts > 0 && <span>{up.attempts} attempt{up.attempts !== 1 ? "s" : ""}</span>}
                  {up.bestScore != null && <span style={{ color: up.bestScore >= 80 ? "#0F6E56" : "#BA7517", fontWeight: 500 }}>Best: {up.bestScore}%</span>}
                </div>
                <button onClick={() => onStart(pw.id)} style={{ fontSize: 12, padding: "6px 14px", border: "0.5px solid #1D9E75", borderRadius: 8, cursor: "pointer", background: "#1D9E75", color: "#fff", fontWeight: 500 }}>
                  {up.status === "achieved" ? "Retake pathway" : up.attempts > 0 ? "Retake pathway" : "Start pathway"}
                  <i className="ti ti-arrow-right" style={{ fontSize: 12, marginLeft: 5 }} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CandidateHistory({ attempts }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Attempt history</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>All your past assessment attempts</div>
      </div>
      {attempts.length === 0
        ? <div style={{ textAlign: "center", padding: "48px 20px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", color: "var(--color-text-tertiary)" }}>
            <i className="ti ti-history" style={{ fontSize: 32, display: "block", marginBottom: 8 }} aria-hidden="true" />
            <div style={{ fontSize: 13 }}>No attempts yet</div>
          </div>
        : [...attempts].reverse().map(a => {
          const pw = PATHWAYS.find(p => p.id === a.pathwayId);
          const cats = {};
          a.detail?.forEach(d => { if (!cats[d.cat]) cats[d.cat] = { c: 0, t: 0 }; cats[d.cat].t++; if (d.isCorrect) cats[d.cat].c++; });
          return (
            <div key={a.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{pw?.name}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{new Date(a.completedAt).toLocaleString()} · {a.correct}/{a.total} correct</div>
                </div>
                <div style={{ fontSize: 22, fontWeight: 500, color: a.score >= 80 ? "#0F6E56" : a.score >= 65 ? "#BA7517" : "#993C1D" }}>{a.score}%</div>
                <div style={{ marginLeft: 10 }}>
                  <UPBadge status={a.passed ? "achieved" : "prep_recommended"} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 6 }}>
                {Object.entries(cats).map(([cat, v]) => (
                  <div key={cat} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "8px 10px" }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginBottom: 3, lineHeight: 1.3 }}>{cat}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: Math.round(v.c / v.t * 100) >= 80 ? "#0F6E56" : "#BA7517" }}>{Math.round(v.c / v.t * 100)}%</div>
                    <div style={{ height: 3, background: "var(--color-border-tertiary)", borderRadius: 2, marginTop: 4 }}>
                      <div style={{ height: 3, width: Math.round(v.c / v.t * 100) + "%", background: Math.round(v.c / v.t * 100) >= 80 ? "#1D9E75" : "#EF9F27", borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

// ─── QUIZ ────────────────────────────────────────────────────────────────────
function Quiz({ quizData, setQuizData, onSubmit, onExit }) {
  const { pw, qs, idx, answers, timer } = quizData;
  const timerRef = useRef(null);
  const [localTimer, setLocalTimer] = useState(timer);
  const [confirmExit, setConfirmExit] = useState(false);
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setLocalTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          onSubmit(answers, qs, pw.id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const select = (optOrigIdx) => {
    const q = qs[idx];
    setQuizData(qd => ({ ...qd, answers: { ...qd.answers, [q.id]: optOrigIdx } }));
  };

  const goTo = (i) => setQuizData(qd => ({ ...qd, idx: i }));

  const q = qs[idx];
  const chosen = answers[q.id];
  const pct = Math.round(((idx + 1) / qs.length) * 100);
  const timerWarn = localTimer < 180;

  return (
    <div style={{ display: "flex", flexDirection: "column", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "var(--color-background-primary)" }}>
      <div style={{ padding: "10px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-primary)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>{pw.name}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: timerWarn ? "#A32D2D" : "var(--color-text-primary)", background: timerWarn ? "#FCEBEB" : "var(--color-background-secondary)", padding: "3px 10px", borderRadius: 20 }}>
            <i className="ti ti-clock" style={{ fontSize: 14 }} aria-hidden="true" />{fmtTimer(localTimer)}
          </div>
          <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Q{idx + 1} / {qs.length} · {answeredCount} answered</span>
        </div>
        <div style={{ height: 4, background: "var(--color-background-secondary)", borderRadius: 2 }}>
          <div style={{ height: 4, width: pct + "%", background: "#1D9E75", borderRadius: 2, transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ padding: 20, flex: 1 }}>
        <div style={{ fontSize: 11, color: "#1D9E75", fontWeight: 500, marginBottom: 6 }}>{q.cat} · {q.diff}</div>
        <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6, marginBottom: 16 }}>{q.q}</div>
        {q.shuffledOpts.map((opt) => (
          <div key={opt.origIdx} onClick={() => select(opt.origIdx)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: chosen === opt.origIdx ? "1.5px solid #1D9E75" : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", marginBottom: 8, cursor: "pointer", background: chosen === opt.origIdx ? "#E1F5EE" : "var(--color-background-primary)", fontSize: 13, color: chosen === opt.origIdx ? "#085041" : "var(--color-text-primary)", transition: "all 0.1s" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: chosen === opt.origIdx ? "2px solid #1D9E75" : "1.5px solid var(--color-border-secondary)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: chosen === opt.origIdx ? "#1D9E75" : "transparent" }}>
              {chosen === opt.origIdx && <i className="ti ti-check" style={{ fontSize: 10, color: "#fff" }} aria-hidden="true" />}
            </div>
            {opt.text}
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 20px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", flexWrap: "wrap", gap: 5 }}>
        {qs.map((qq, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: 28, height: 28, borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: "pointer", border: "none", background: i === idx ? "#1D9E75" : answers[qq.id] != null ? "#E1F5EE" : "var(--color-background-secondary)", color: i === idx ? "#fff" : answers[qq.id] != null ? "#0F6E56" : "var(--color-text-secondary)" }}>
            {i + 1}
          </button>
        ))}
      </div>

      <div style={{ padding: "10px 20px", borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--color-background-primary)" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {!confirmExit
            ? <button onClick={() => setConfirmExit(true)} style={{ fontSize: 12, padding: "6px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, cursor: "pointer", background: "transparent", color: "var(--color-text-secondary)" }}>
                <i className="ti ti-x" style={{ fontSize: 12 }} aria-hidden="true" /> Exit
              </button>
            : <>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", alignSelf: "center" }}>Exit and lose progress?</span>
                <button onClick={onExit} style={{ fontSize: 12, padding: "5px 10px", border: "0.5px solid #E24B4A", borderRadius: 8, cursor: "pointer", background: "#FCEBEB", color: "#A32D2D" }}>Yes, exit</button>
                <button onClick={() => setConfirmExit(false)} style={{ fontSize: 12, padding: "5px 10px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, cursor: "pointer", background: "transparent", color: "var(--color-text-secondary)" }}>Cancel</button>
              </>
          }
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0}
            style={{ fontSize: 12, padding: "6px 12px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, cursor: idx === 0 ? "default" : "pointer", background: "transparent", color: "var(--color-text-secondary)", opacity: idx === 0 ? 0.4 : 1 }}>
            <i className="ti ti-arrow-left" style={{ fontSize: 12 }} aria-hidden="true" /> Prev
          </button>
          {idx < qs.length - 1
            ? <button onClick={() => goTo(idx + 1)} style={{ fontSize: 12, padding: "6px 14px", border: "none", borderRadius: 8, cursor: "pointer", background: "#1D9E75", color: "#fff", fontWeight: 500 }}>
                Next <i className="ti ti-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
              </button>
            : <button onClick={() => { clearInterval(timerRef.current); onSubmit(answers, qs, pw.id); }}
                style={{ fontSize: 12, padding: "6px 16px", border: "none", borderRadius: 8, cursor: "pointer", background: "#0F6E56", color: "#fff", fontWeight: 500 }}>
                <i className="ti ti-flag" style={{ fontSize: 12 }} aria-hidden="true" /> Submit ({answeredCount}/{qs.length})
              </button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── RESULT ──────────────────────────────────────────────────────────────────
function Result({ result, pw, onBack, onRetake }) {
  const cats = {};
  result.detail?.forEach(d => {
    if (!cats[d.cat]) cats[d.cat] = { c: 0, t: 0 };
    cats[d.cat].t++;
    if (d.isCorrect) cats[d.cat].c++;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "var(--color-background-primary)", padding: 24 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", margin: "0 auto 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: result.passed ? "#E1F5EE" : "#FAECE7", border: `2px solid ${result.passed ? "#5DCAA5" : "#F0997B"}` }}>
          <div style={{ fontSize: 28, fontWeight: 500, color: result.passed ? "#0F6E56" : "#993C1D" }}>{result.score}%</div>
          <div style={{ fontSize: 10, color: result.passed ? "#0F6E56" : "#993C1D" }}>{result.passed ? "Pass" : "Below pass"}</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{result.passed ? "Readiness Achieved" : "Additional Preparation Recommended"}</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20, lineHeight: 1.55 }}>
          {result.passed
            ? `You answered ${result.correct} of ${result.total} correctly and have demonstrated readiness for ${pw.name}.`
            : `You answered ${result.correct} of ${result.total} correctly. A score of 80% is required. Review the categories below and retake when ready.`}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20, textAlign: "left" }}>
          {Object.entries(cats).map(([cat, v]) => {
            const pct = Math.round(v.c / v.t * 100);
            return (
              <div key={cat} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4, lineHeight: 1.3 }}>{cat}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: pct >= 80 ? "#0F6E56" : pct >= 65 ? "#BA7517" : "#993C1D" }}>{pct}%</div>
                <div style={{ height: 3, background: "var(--color-border-tertiary)", borderRadius: 2, marginTop: 5 }}>
                  <div style={{ height: 3, width: pct + "%", background: pct >= 80 ? "#1D9E75" : pct >= 65 ? "#EF9F27" : "#E24B4A", borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 3 }}>{v.c}/{v.t} correct</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={onBack} style={{ fontSize: 12, padding: "7px 14px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, cursor: "pointer", background: "transparent", color: "var(--color-text-secondary)" }}>
            <i className="ti ti-arrow-left" style={{ fontSize: 12 }} aria-hidden="true" /> Dashboard
          </button>
          <button onClick={onRetake} style={{ fontSize: 12, padding: "7px 16px", border: "none", borderRadius: 8, cursor: "pointer", background: "#1D9E75", color: "#fff", fontWeight: 500 }}>
            <i className="ti ti-refresh" style={{ fontSize: 12 }} aria-hidden="true" /> Retake pathway
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN LAYOUT ────────────────────────────────────────────────────────────
function AdminLayout({ me, onLogout, page, setPage, users, attempts, userPathways, onApprove, onReject, reload }) {
  const navItems = [
    { id: "s1", label: "Admin", section: true },
    { id: "admin_dash", label: "Overview", icon: "ti-layout-dashboard" },
    { id: "admin_users", label: "Users", icon: "ti-users" },
    { id: "admin_progress", label: "Progress", icon: "ti-chart-bar" },
  ];
  const curPage = page.startsWith("admin") ? page : "admin_dash";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 600, border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "var(--color-background-primary)" }}>
      <Topbar me={me} onLogout={onLogout} />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar items={navItems} active={curPage} onNav={setPage} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          {curPage === "admin_dash" && <AdminDash users={users} attempts={attempts} userPathways={userPathways} onApprove={onApprove} onReject={onReject} reload={reload} />}
          {curPage === "admin_users" && <AdminUsers users={users} attempts={attempts} userPathways={userPathways} onApprove={onApprove} onReject={onReject} reload={reload} />}
          {curPage === "admin_progress" && <AdminProgress users={users} attempts={attempts} userPathways={userPathways} />}
        </div>
      </div>
    </div>
  );
}

function AdminDash({ users, attempts, userPathways, onApprove, onReject, reload }) {
  const candidates = Object.values(users).filter(u => u.role === "candidate");
  const pending = candidates.filter(u => u.status === "pending_approval");
  const completed = attempts.filter(a => a.score != null);
  const passRate = completed.length ? Math.round(completed.filter(a => a.passed).length / completed.length * 100) : 0;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Administration overview</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>SUZA Seaweed Tissue Culture Laboratory - Lab Access Readiness</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { n: candidates.length, l: "Total candidates" },
          { n: pending.length, l: "Pending approval", c: pending.length > 0 ? "#BA7517" : undefined },
          { n: completed.length, l: "Total attempts" },
          { n: passRate + "%", l: "Pass rate", c: passRate >= 70 ? "#0F6E56" : "#BA7517" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: s.c || "var(--color-text-primary)" }}>{s.n}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {pending.length > 0 && (
        <div style={{ background: "#FAEEDA", border: "0.5px solid #FAC775", borderRadius: "var(--border-radius-md)", padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <i className="ti ti-alert-triangle" style={{ color: "#BA7517", fontSize: 16 }} aria-hidden="true" />
          <div style={{ flex: 1, fontSize: 12, color: "#633806" }}>{pending.length} candidate{pending.length !== 1 ? "s" : ""} awaiting approval</div>
          <div style={{ display: "flex", gap: 8 }}>
            {pending.map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: "4px 10px" }}>
                <span style={{ fontSize: 12, color: "var(--color-text-primary)" }}>{u.name}</span>
                <button onClick={() => { onApprove(u.id); reload(); }} style={{ fontSize: 11, padding: "2px 8px", border: "0.5px solid #9FE1CB", borderRadius: 6, cursor: "pointer", background: "#E1F5EE", color: "#0F6E56" }}>Approve</button>
                <button onClick={() => { onReject(u.id); reload(); }} style={{ fontSize: 11, padding: "2px 8px", border: "0.5px solid #F5C4B3", borderRadius: 6, cursor: "pointer", background: "#FAECE7", color: "#993C1D" }}>Reject</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <i className="ti ti-chart-bar" style={{ color: "#1D9E75", fontSize: 15 }} aria-hidden="true" />Pass rate by pathway
          </div>
          {PATHWAYS.map(pw => {
            const pwAttempts = completed.filter(a => a.pathwayId === pw.id);
            const pct = pwAttempts.length ? Math.round(pwAttempts.filter(a => a.passed).length / pwAttempts.length * 100) : null;
            return (
              <div key={pw.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", width: 140, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pw.name.replace(" Readiness", "")}</div>
                <div style={{ flex: 1, height: 6, background: "var(--color-background-secondary)", borderRadius: 3 }}>
                  {pct != null && <div style={{ height: 6, width: pct + "%", background: pct >= 80 ? "#1D9E75" : pct >= 65 ? "#EF9F27" : "#E24B4A", borderRadius: 3 }} />}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", width: 36, textAlign: "right" }}>{pct != null ? pct + "%" : "-"}</div>
              </div>
            );
          })}
        </div>
        <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <i className="ti ti-clock" style={{ color: "#1D9E75", fontSize: 15 }} aria-hidden="true" />Recent attempts
          </div>
          {completed.length === 0
            ? <div style={{ textAlign: "center", padding: "20px 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>No attempts yet</div>
            : [...completed].reverse().slice(0, 5).map(a => {
              const u = users[a.userId];
              return (
                <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", marginBottom: 5 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, color: "#0F6E56", flexShrink: 0 }}>{u ? initials(u.name) : "?"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u?.name || "Unknown"}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{new Date(a.completedAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: a.score >= 80 ? "#0F6E56" : a.score >= 65 ? "#BA7517" : "#993C1D" }}>{a.score}%</div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

function AdminUsers({ users, attempts, userPathways, onApprove, onReject, reload }) {
  const [filter, setFilter] = useState("all");
  const candidates = Object.values(users).filter(u => u.role === "candidate");
  const filtered = filter === "all" ? candidates : candidates.filter(u => u.status === filter);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>User management</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>Manage candidate registrations, approvals, and access</div>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[["all", "All"], ["pending_approval", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["suspended", "Suspended"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            style={{ fontSize: 12, padding: "5px 12px", border: `0.5px solid ${filter === v ? "#1D9E75" : "var(--color-border-secondary)"}`, borderRadius: 20, cursor: "pointer", background: filter === v ? "#E1F5EE" : "transparent", color: filter === v ? "#0F6E56" : "var(--color-text-secondary)", fontWeight: filter === v ? 500 : 400 }}>
            {l}
          </button>
        ))}
      </div>
      {filtered.length === 0
        ? <div style={{ textAlign: "center", padding: "48px 20px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", color: "var(--color-text-tertiary)", fontSize: 13 }}>No users in this category</div>
        : filtered.map(u => {
          const uAttempts = attempts.filter(a => a.userId === u.id);
          const up = Object.values(userPathways).filter(p => p.userId === u.id);
          return (
            <div key={u.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 14, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#0F6E56", flexShrink: 0 }}>{initials(u.name)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</span>
                    <UStatusBadge status={u.status} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{u.email} · {u.institution} · {u.position}</div>
                  {u.department && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Dept: {u.department}</div>}
                  <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                    Registered: {new Date(u.createdAt).toLocaleDateString()} · {uAttempts.length} attempt{uAttempts.length !== 1 ? "s" : ""}
                    {up.length > 0 && ` · ${up.filter(p => p.status === "achieved").length}/${up.length} pathways achieved`}
                  </div>
                </div>
                {u.status === "pending_approval" && (
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => { onApprove(u.id); reload(); }} style={{ fontSize: 11, padding: "5px 10px", border: "0.5px solid #9FE1CB", borderRadius: 7, cursor: "pointer", background: "#E1F5EE", color: "#0F6E56", fontWeight: 500 }}>
                      <i className="ti ti-check" style={{ fontSize: 11 }} aria-hidden="true" /> Approve
                    </button>
                    <button onClick={() => { onReject(u.id); reload(); }} style={{ fontSize: 11, padding: "5px 10px", border: "0.5px solid #F5C4B3", borderRadius: 7, cursor: "pointer", background: "#FAECE7", color: "#993C1D", fontWeight: 500 }}>
                      <i className="ti ti-x" style={{ fontSize: 11 }} aria-hidden="true" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

function AdminProgress({ users, attempts, userPathways }) {
  const candidates = Object.values(users).filter(u => u.role === "candidate" && u.status === "approved");

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>Trainee progress</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3 }}>Live progress tracking for all approved candidates</div>
      </div>
      {candidates.length === 0
        ? <div style={{ textAlign: "center", padding: "48px 20px", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", color: "var(--color-text-tertiary)" }}>
            <i className="ti ti-users" style={{ fontSize: 32, display: "block", marginBottom: 8 }} aria-hidden="true" />
            <div style={{ fontSize: 13 }}>No approved candidates yet. Approve registrations to see progress here.</div>
          </div>
        : candidates.map(u => {
          const uAttempts = attempts.filter(a => a.userId === u.id);
          const up = Object.values(userPathways).filter(p => p.userId === u.id);
          const best = uAttempts.length ? Math.max(...uAttempts.map(a => a.score)) : null;
          const lastAttempt = uAttempts.length ? uAttempts.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0] : null;

          const catScores = {};
          uAttempts.forEach(a => {
            a.detail?.forEach(d => {
              if (!catScores[d.cat]) catScores[d.cat] = { c: 0, t: 0 };
              catScores[d.cat].t++;
              if (d.isCorrect) catScores[d.cat].c++;
            });
          });

          return (
            <div key={u.id} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 16, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#0F6E56", flexShrink: 0 }}>{initials(u.name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{u.institution} · {u.position}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 500, color: best != null ? (best >= 80 ? "#0F6E56" : best >= 65 ? "#BA7517" : "#993C1D") : "var(--color-text-tertiary)" }}>
                    {best != null ? best + "%" : "-"}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>Best score</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                {[
                  { l: "Attempts", v: uAttempts.length },
                  { l: "Passed", v: uAttempts.filter(a => a.passed).length },
                  { l: "Last attempt", v: lastAttempt ? new Date(lastAttempt.completedAt).toLocaleDateString() : "None" },
                  { l: "Pathways achieved", v: up.filter(p => p.status === "achieved").length + "/" + up.length },
                ].map((s, i) => (
                  <div key={i} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "6px 10px", fontSize: 11 }}>
                    <div style={{ color: "var(--color-text-tertiary)" }}>{s.l}</div>
                    <div style={{ fontWeight: 500, color: "var(--color-text-primary)", marginTop: 1 }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {Object.keys(catScores).length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 6 }}>Performance by category (cumulative)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 5 }}>
                    {Object.entries(catScores).map(([cat, v]) => {
                      const pct = Math.round(v.c / v.t * 100);
                      return (
                        <div key={cat} style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "7px 9px" }}>
                          <div style={{ fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.3, marginBottom: 3 }}>{cat}</div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: pct >= 80 ? "#0F6E56" : pct >= 65 ? "#BA7517" : "#993C1D" }}>{pct}%</div>
                          <div style={{ height: 3, background: "var(--color-border-tertiary)", borderRadius: 2, marginTop: 3 }}>
                            <div style={{ height: 3, width: pct + "%", background: pct >= 80 ? "#1D9E75" : pct >= 65 ? "#EF9F27" : "#E24B4A", borderRadius: 2 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {uAttempts.length === 0 && (
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", padding: "8px 0", borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: 4 }}>
                  No attempts yet - pathway assigned and waiting to start
                </div>
              )}
            </div>
          );
        })
      }
    </div>
  );
}

// ─── LOGIN / REGISTER ────────────────────────────────────────────────────────
function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr(""); setLoading(true);
    const error = await onLogin(email, pw);
    setLoading(false);
    if (error) setErr(error);
  };
  const onKey = (e) => { if (e.key === "Enter") handle(); };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <i className="ti ti-flask" style={{ fontSize: 24, color: "#0F6E56" }} aria-hidden="true" />
          <span style={{ fontSize: 16, fontWeight: 500 }}>Lab Access Readiness</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>SUZA Seaweed Tissue Culture Laboratory</div>
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Sign in</div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 20 }}>Access your readiness pathways and records</div>
        {err && <div style={{ background: "var(--color-background-danger)", border: "0.5px solid var(--color-border-danger)", borderRadius: "var(--border-radius-md)", padding: "8px 12px", fontSize: 12, color: "var(--color-text-danger)", marginBottom: 16 }}>{err}</div>}
        <div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey} placeholder="your@email.com" style={{ width: "100%" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={onKey} placeholder="Password" style={{ width: "100%", paddingRight: 36 }} />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
                <i className={`ti ti-eye${showPw ? "-off" : ""}`} style={{ fontSize: 16 }} aria-hidden="true" />
              </button>
            </div>
          </div>
          <button onClick={handle} disabled={loading} style={{ width: "100%", padding: "9px 0", background: "#1D9E75", border: "none", borderRadius: "var(--border-radius-md)", color: "#fff", fontSize: 13, fontWeight: 500, cursor: loading ? "wait" : "pointer" }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--color-text-secondary)" }}>
          No account?{" "}
          <button onClick={onRegister} style={{ background: "none", border: "none", cursor: "pointer", color: "#0F6E56", fontWeight: 500, fontSize: 12, padding: 0 }}>Register here</button>
        </div>
        <div style={{ marginTop: 20, padding: "10px 12px", background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", fontSize: 11, color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-text-primary)" }}>Admin logins:</strong> danford.mkunda@cbiio.com · lavine.irvine@cbiio.com · steven.sillah@cbiio.com
        </div>
      </div>
    </div>
  );
}

function Register({ onRegister, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", institution: "", position: "", department: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handle = async () => {
    setErr("");
    if (!form.name || !form.email || !form.password || !form.institution || !form.position) { setErr("Please fill in all required fields."); return; }
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (form.password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    setLoading(true);
    const error = await onRegister(form);
    setLoading(false);
    if (error) { setErr(error); return; }
    setDone(true);
  };

  if (done) return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "#E1F5EE", border: "0.5px solid #9FE1CB", borderRadius: "var(--border-radius-lg)", padding: 28, textAlign: "center" }}>
        <i className="ti ti-circle-check" style={{ fontSize: 36, color: "#0F6E56", display: "block", marginBottom: 12 }} aria-hidden="true" />
        <div style={{ fontSize: 15, fontWeight: 500, color: "#085041", marginBottom: 6 }}>Registration submitted</div>
        <div style={{ fontSize: 13, color: "#0F6E56", lineHeight: 1.55, marginBottom: 16 }}>Your account is awaiting administrator approval. You will be able to log in and access pathways once approved.</div>
        <button onClick={onBack} style={{ fontSize: 13, padding: "7px 20px", background: "#1D9E75", border: "none", borderRadius: "var(--border-radius-md)", color: "#fff", cursor: "pointer" }}>Back to sign in</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <i className="ti ti-flask" style={{ fontSize: 22, color: "#0F6E56" }} aria-hidden="true" />
          <span style={{ fontSize: 15, fontWeight: 500 }}>Lab Access Readiness</span>
        </div>
      </div>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Create account</div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 18 }}>Submit your registration for laboratory access. An administrator will review and approve your account.</div>
        {err && <div style={{ background: "var(--color-background-danger)", border: "0.5px solid var(--color-border-danger)", borderRadius: "var(--border-radius-md)", padding: "8px 12px", fontSize: 12, color: "var(--color-text-danger)", marginBottom: 14 }}>{err}</div>}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <div style={{ gridColumn: "1/-1", marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Full name<span style={{ color: "#1D9E75" }}>*</span></label>
              <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Dr. Amina Mwangi" style={{ width: "100%" }} />
            </div>
            <div style={{ gridColumn: "1/-1", marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Email address<span style={{ color: "#1D9E75" }}>*</span></label>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="amina@suza.ac.tz" style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Password<span style={{ color: "#1D9E75" }}>*</span></label>
              <input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min. 8 characters" style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Confirm password<span style={{ color: "#1D9E75" }}>*</span></label>
              <input type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} placeholder="Repeat password" style={{ width: "100%" }} />
            </div>
            <div style={{ gridColumn: "1/-1", marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Institution / organisation<span style={{ color: "#1D9E75" }}>*</span></label>
              <input type="text" value={form.institution} onChange={e => set("institution", e.target.value)} placeholder="State University of Zanzibar" style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Position / title<span style={{ color: "#1D9E75" }}>*</span></label>
              <input type="text" value={form.position} onChange={e => set("position", e.target.value)} placeholder="Research Technician" style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 5 }}>Department</label>
              <input type="text" value={form.department} onChange={e => set("department", e.target.value)} placeholder="Marine Biology" style={{ width: "100%" }} />
            </div>
          </div>
          <button onClick={handle} disabled={loading} style={{ width: "100%", padding: "9px 0", background: "#1D9E75", border: "none", borderRadius: "var(--border-radius-md)", color: "#fff", fontSize: 13, fontWeight: 500, cursor: loading ? "wait" : "pointer", marginTop: 6 }}>
            {loading ? "Submitting..." : "Submit registration"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "var(--color-text-secondary)" }}>
          Already have an account?{" "}
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#0F6E56", fontWeight: 500, fontSize: 12, padding: 0 }}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED BADGE COMPONENTS ─────────────────────────────────────────────────
function UPBadge({ status }) {
  const map = {
    achieved: { bg: "#E1F5EE", color: "#085041", label: "Readiness achieved" },
    assigned: { bg: "#E6F1FB", color: "#0C447C", label: "Ready to start" },
    in_progress: { bg: "#FAEEDA", color: "#633806", label: "In progress" },
    prep_recommended: { bg: "#FAECE7", color: "#712B13", label: "Prep recommended" },
    locked: { bg: "var(--color-background-secondary)", color: "var(--color-text-tertiary)", label: "Locked" },
  };
  const s = map[status] || map.locked;
  return <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: s.bg, color: s.color, fontWeight: 500, whiteSpace: "nowrap" }}>{s.label}</span>;
}

function UStatusBadge({ status }) {
  const map = {
    approved: { bg: "#E1F5EE", color: "#085041", label: "Approved" },
    pending_approval: { bg: "#FAEEDA", color: "#633806", label: "Pending approval" },
    pending_verification: { bg: "#E6F1FB", color: "#0C447C", label: "Pending verification" },
    rejected: { bg: "#FCEBEB", color: "#791F1F", label: "Rejected" },
    suspended: { bg: "var(--color-background-secondary)", color: "var(--color-text-tertiary)", label: "Suspended" },
  };
  const s = map[status] || map.suspended;
  return <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: s.bg, color: s.color, fontWeight: 500, whiteSpace: "nowrap" }}>{s.label}</span>;
}
