export interface CollaborativeChallenge {
  id: string;
  code: string;
  title: string;
  targetProduct: string;
  category: 'Pharmaceutical' | 'Renewable Energy' | 'Advanced Materials' | 'Atmospheric Fixation';
  difficulty: 'Standard' | 'Elevated' | 'Master';
  // Explore player's asymmetric view
  exploreClues: {
    reagents: string[];
    criticalHint: string;
    targetParameterKey: string;
    validOptions: string[];
    correctOption: string;
  };
  // Control player's asymmetric view
  controlClues: {
    environmentConstraints: string[];
    criticalHint: string;
    targetParameterKey: string;
    validOptions: string[];
    correctOption: string;
  };
  // Combined solution and outcome
  synthesisMechanism: string;
  realWorldImpact: string;
}

export const COLLABORATIVE_CHALLENGES: CollaborativeChallenge[] = [
  // 1. Aspirin Synthesis
  {
    id: 'collab-1',
    code: 'SYN-01',
    title: 'Acetylsalicylic Acid (Aspirin)',
    targetProduct: 'C₉H₈O₄ (Aspirin)',
    category: 'Pharmaceutical',
    difficulty: 'Standard',
    exploreClues: {
      reagents: ['Salicylic acid (phenolic precursor)', 'Excess Acetic Anhydride', 'Sulfuric acid acid-catalyst'],
      criticalHint: 'The phenolic hydroxyl group must undergo esterification with the acyl donor.',
      targetParameterKey: 'Select Primary Reagent',
      validOptions: ['Salicylic Acid', 'Benzoic Acid', 'Citric Acid', 'Lactic Acid'],
      correctOption: 'Salicylic Acid',
    },
    controlClues: {
      environmentConstraints: ['Water bath maintained between 50°C and 60°C', 'Avoid boiling above 85°C to prevent decomposition', 'Cool in ice bath to induce crystal precipitation'],
      criticalHint: 'Temperature must not exceed 60°C during the acetylation phase.',
      targetParameterKey: 'Select Safe Reaction Temp',
      validOptions: ['50°C - 60°C Warm Bath', '100°C Boiling Reflux', '0°C Freezing Slurry', '250°C Furnace'],
      correctOption: '50°C - 60°C Warm Bath',
    },
    synthesisMechanism: 'Salicylic acid reacts with acetic anhydride in the presence of an acid catalyst via nucleophilic acyl substitution to yield acetylsalicylic acid and acetic acid.',
    realWorldImpact: 'Synthesized by Felix Hoffmann in 1897, aspirin remains one of the world’s most widely consumed anti-inflammatory and cardioprotective medications.',
  },

  // 2. Paracetamol Synthesis
  {
    id: 'collab-2',
    code: 'SYN-02',
    title: 'Acetaminophen (Paracetamol)',
    targetProduct: 'C₈H₉NO₂ (Paracetamol)',
    category: 'Pharmaceutical',
    difficulty: 'Standard',
    exploreClues: {
      reagents: ['4-Aminophenol (aromatic amine)', 'Acetic Anhydride acyl donor', 'Aqueous sodium hydroxide buffer'],
      criticalHint: 'The amine nitrogen is far more nucleophilic than the phenolic oxygen, so it acetylates preferentially.',
      targetParameterKey: 'Select Active Nucleophile',
      validOptions: ['4-Aminophenol', 'Nitrobenzene', 'Phenol', 'Aniline'],
      correctOption: '4-Aminophenol',
    },
    controlClues: {
      environmentConstraints: ['Reflux at 80°C for 20 minutes', 'Slow cooling to 10°C to maximize crystallization', 'pH buffered to neutral 7.0 to prevent hydrolysis'],
      criticalHint: 'Amine selective acetylation occurs optimally around pH 7.0 at 80°C.',
      targetParameterKey: 'Select Buffer pH',
      validOptions: ['pH 7.0 Neutral Buffer', 'pH 1.0 Concentrated Acid', 'pH 14.0 Strong Alkali', 'Non-aqueous Organic'],
      correctOption: 'pH 7.0 Neutral Buffer',
    },
    synthesisMechanism: 'Selective N-acetylation of 4-aminophenol with acetic anhydride forms the amide linkage without acylating the aromatic hydroxyl.',
    realWorldImpact: 'The primary active analgesic and antipyretic recommended globally on the WHO Model List of Essential Medicines.',
  },

  // 3. Graphene Exfoliation
  {
    id: 'collab-3',
    code: 'SYN-03',
    title: 'Monolayer Graphene Liquid Exfoliation',
    targetProduct: '2D Monolayer Carbon Lattice (Graphene)',
    category: 'Advanced Materials',
    difficulty: 'Elevated',
    exploreClues: {
      reagents: ['Natural graphite flake precursor', 'N-Methyl-2-pyrrolidone (NMP) solvent', 'Surfactant stabilizer sodium cholate'],
      criticalHint: 'The solvent surface energy must precisely match that of graphite (~68 mJ/m²) to overcome interlayer van der Waals forces.',
      targetParameterKey: 'Select Optimal Matching Solvent',
      validOptions: ['N-Methyl-2-pyrrolidone (NMP)', 'Liquid Ammonia', 'Pure Hexane', 'Vegetable Oil'],
      correctOption: 'N-Methyl-2-pyrrolidone (NMP)',
    },
    controlClues: {
      environmentConstraints: ['High-shear sonic probe frequency at 24 kHz', 'Chilled water jacket at 15°C to dissipate ultrasonic heat', 'Centrifugation at 4000 rpm for 45 minutes'],
      criticalHint: 'Shear cavitation peeling requires ultrasound frequencies above 20 kHz without thermal degradation.',
      targetParameterKey: 'Select Ultrasonic Energy',
      validOptions: ['24 kHz Sonication Probe', 'Low-frequency 60 Hz Hum', '100 MHz Radio Wave', 'Silent Static Hold'],
      correctOption: '24 kHz Sonication Probe',
    },
    synthesisMechanism: 'Ultrasonic acoustic cavitation bubbles collapse violently against graphite flakes, exerting lateral shear stress that peels single-atom sheets.',
    realWorldImpact: 'Produces ultra-conductive, ultra-lightweight sheets for next-generation flexible electronics, thermal heat spreaders, and quantum sensors.',
  },

  // 4. Lithium-Ion Cathode (LiFePO4)
  {
    id: 'collab-4',
    code: 'SYN-04',
    title: 'Lithium Iron Phosphate (LFP) Cathode',
    targetProduct: 'LiFePO₄ Olivine Nanocrystals',
    category: 'Renewable Energy',
    difficulty: 'Elevated',
    exploreClues: {
      reagents: ['Lithium carbonate (Li₂CO₃)', 'Iron(II) acetate precursor', 'Ammonium dihydrogen phosphate (NH₄H₂PO₄)'],
      criticalHint: 'Iron must be kept strictly in the Fe²⁺ oxidation state; any oxidation to Fe³⁺ degrades battery capacity.',
      targetParameterKey: 'Target Iron Valence State',
      validOptions: ['Fe²⁺ (Ferrous)', 'Fe³⁺ (Ferric)', 'Fe⁰ (Metallic)', 'Fe⁶⁺ (Ferrate)'],
      correctOption: 'Fe²⁺ (Ferrous)',
    },
    controlClues: {
      environmentConstraints: ['Calcination in a tube furnace at 700°C', 'Inert Argon atmosphere with 5% H₂ reducing gas', 'Carbon black nano-coating addition'],
      criticalHint: 'An inert or reducing atmosphere (Ar/H₂) is essential to prevent air from oxidizing iron.',
      targetParameterKey: 'Select Shielding Atmosphere',
      validOptions: ['Argon + 5% H₂ Reducing Gas', 'Pure Oxygen Sweep', 'Ambient Humid Air', 'Vacuum with Chlorine Gas'],
      correctOption: 'Argon + 5% H₂ Reducing Gas',
    },
    synthesisMechanism: 'Solid-state hydrothermal calcination arranges lithium, iron, and phosphate ions into an ordered 1D tunnel olivine crystal lattice.',
    realWorldImpact: 'Powers modern long-life electric vehicles and stationary clean-energy battery grids with unmatched thermal safety and zero cobalt.',
  },

  // 5. Penicillin Core (6-APA)
  {
    id: 'collab-5',
    code: 'SYN-05',
    title: 'Beta-Lactam Core (6-APA Penicillin)',
    targetProduct: '6-Aminopenicillanic Acid (Beta-Lactam Ring)',
    category: 'Pharmaceutical',
    difficulty: 'Master',
    exploreClues: {
      reagents: ['Penicillin G crude broth', 'Immobilized Penicillin Acylase enzyme', 'Aqueous buffer solution'],
      criticalHint: 'Penicillin acylase enzymatically hydrolyzes the sidechain phenylacetic acid without cleaving the strained 4-membered lactam ring.',
      targetParameterKey: 'Select Selective Biocatalyst',
      validOptions: ['Penicillin Acylase', 'Pepsin Protease', 'Amylase', 'Lipase'],
      correctOption: 'Penicillin Acylase',
    },
    controlClues: {
      environmentConstraints: ['Enzymatic reactor temperature at 37°C', 'pH strictly regulated between 7.8 and 8.0 with ammonium hydroxide', 'Continuous removal of phenylacetic acid byproduct'],
      criticalHint: 'The enzyme denatures if pH drops below 7.0 or temperature exceeds 42°C.',
      targetParameterKey: 'Select Operational pH Range',
      validOptions: ['pH 7.8 - 8.0 Mild Alkaline', 'pH 2.0 Concentrated Acid', 'pH 12.0 Caustic Soda', 'pH 4.5 Acidic Acetate'],
      correctOption: 'pH 7.8 - 8.0 Mild Alkaline',
    },
    synthesisMechanism: 'Enzymatic cleavage of the amide acyl sidechain yields the universal 6-APA core used to synthesize amoxicillin and semi-synthetic antibiotics.',
    realWorldImpact: 'Forms the chemical foundation for modern beta-lactam antibiotics, saving tens of millions of lives annually from bacterial infections.',
  },

  // 6. Biodiesel Transesterification
  {
    id: 'collab-6',
    code: 'SYN-06',
    title: 'Fatty Acid Methyl Ester (Biodiesel)',
    targetProduct: 'R-COOCH₃ + Glycerol (Biodiesel)',
    category: 'Renewable Energy',
    difficulty: 'Standard',
    exploreClues: {
      reagents: ['Used cooking vegetable oil (triglycerides)', 'Anhydrous Methanol (CH₃OH)', 'Sodium Methoxide (CH₃ONa) base catalyst'],
      criticalHint: 'A 6:1 molar excess of methanol drives the reversible transesterification equilibrium toward high methyl ester yield.',
      targetParameterKey: 'Select Alcohol Reagent',
      validOptions: ['Anhydrous Methanol', 'Glycerol', 'Water', 'Isopropyl Ether'],
      correctOption: 'Anhydrous Methanol',
    },
    controlClues: {
      environmentConstraints: ['Maintain reaction at 60°C (just below methanol boiling point of 64.7°C)', 'Continuous mechanical stirring at 600 rpm', 'Phase gravity separation to drain dense bottom glycerol layer'],
      criticalHint: 'Operating just below the solvent boiling point ensures fast kinetics without vapor boil-off.',
      targetParameterKey: 'Select Reaction Temperature',
      validOptions: ['60°C (Sub-Boiling)', '150°C Superheated', '0°C Freezing', '500°C Calcination'],
      correctOption: '60°C (Sub-Boiling)',
    },
    synthesisMechanism: 'Base-catalyzed transesterification replaces the glycerol backbone of triglycerides with methyl groups, reducing viscosity for diesel engines.',
    realWorldImpact: 'Recycles waste food oils into drop-in renewable transportation fuel, reducing carbon emissions by up to 80% compared to fossil diesel.',
  },

  // 7. Nylon 6,6 Interfacial Polymerization
  {
    id: 'collab-7',
    code: 'SYN-07',
    title: 'Nylon 6,6 Polymer Rope',
    targetProduct: '[-NH-(CH₂)₆-NH-CO-(CH₂)₄-CO-]ₙ',
    category: 'Advanced Materials',
    difficulty: 'Standard',
    exploreClues: {
      reagents: ['Hexamethylenediamine in aqueous phase', 'Adipoyl chloride in organic hexane phase', 'Sodium hydroxide acid scavenger'],
      criticalHint: 'The polymerization occurs strictly at the immiscible liquid-liquid interface between water and hexane.',
      targetParameterKey: 'Select Aqueous Diamine Monomer',
      validOptions: ['Hexamethylenediamine', 'Glucose', 'Ethylene Glycol', 'Acetic Acid'],
      correctOption: 'Hexamethylenediamine',
    },
    controlClues: {
      environmentConstraints: ['Ambient room temperature 20°C', 'Zero mixing/stirring—keep two phases sharply separated', 'Slow continuous pulling of the central film with tweezers'],
      criticalHint: 'Do NOT stir! The film forms only at the static interface and must be pulled out as an unbroken rope.',
      targetParameterKey: 'Select Mechanical Agitation Mode',
      validOptions: ['Zero Stirring / Static Pull', 'High-shear Vortex Mixer', 'Boiling Reflux', 'Ultrasonic Sonication'],
      correctOption: 'Zero Stirring / Static Pull',
    },
    synthesisMechanism: 'Interfacial condensation polymerization: nucleophilic acyl substitution between diamine and diacyl chloride forms an infinitely renewable polymer film.',
    realWorldImpact: 'Wallace Carothers invented Nylon at DuPont in 1935, sparking the synthetic fiber revolution in textiles, surgical sutures, and mountaineering ropes.',
  },

  // 8. Haber-Bosch Green Ammonia
  {
    id: 'collab-8',
    code: 'SYN-08',
    title: 'Electrolytic Green Ammonia',
    targetProduct: 'Pure Liquid NH₃ Fuel',
    category: 'Atmospheric Fixation',
    difficulty: 'Elevated',
    exploreClues: {
      reagents: ['Green Hydrogen from PEM water electrolysis', 'Nitrogen gas from cryogenic air separation unit', 'Promoted wüstite iron catalyst'],
      criticalHint: 'A stoichiometric 3:1 ratio of H₂ to N₂ is required to optimize conversion.',
      targetParameterKey: 'Select H₂:N₂ Feed Ratio',
      validOptions: ['3:1 Hydrogen to Nitrogen', '1:1 Equimolar', '1:3 Nitrogen Rich', '10:1 Pure Hydrogen'],
      correctOption: '3:1 Hydrogen to Nitrogen',
    },
    controlClues: {
      environmentConstraints: ['Compress to 180 bar operating pressure', 'Maintain thermal reactor core at 425°C', 'Condensation loop at -33°C to liquefy ammonia product'],
      criticalHint: 'Continuous condensation of NH₃ at -33°C shifts Le Chatelier’s equilibrium to 99% cumulative conversion.',
      targetParameterKey: 'Select Product Extraction Temp',
      validOptions: ['-33°C Refrigerated Condenser', '+200°C Superheated Vapor', '+25°C Ambient Flash', '+600°C Plasma Burn'],
      correctOption: '-33°C Refrigerated Condenser',
    },
    synthesisMechanism: 'Dissociative chemisorption of N₂ on iron crystal facets followed by stepwise hydrogenation yields anhydrous ammonia fuel.',
    realWorldImpact: 'Eliminates fossil methane feedstock from fertilizer production and provides a carbon-free liquid hydrogen carrier for ocean shipping.',
  },

  // 9. Aerogel Superinsulator
  {
    id: 'collab-9',
    code: 'SYN-09',
    title: 'Silica Aerogel (Frozen Smoke)',
    targetProduct: '99.8% Air Nanoporous Silica Aerogel',
    category: 'Advanced Materials',
    difficulty: 'Master',
    exploreClues: {
      reagents: ['Tetramethyl orthosilicate (TMOS) precursor', 'Ethanol solvent', 'Ammonium hydroxide basic catalyst'],
      criticalHint: 'Sol-gel hydrolysis creates a nanoporous silica wet-gel network filled with liquid alcohol.',
      targetParameterKey: 'Select Sol-Gel Precursor',
      validOptions: ['Tetramethyl orthosilicate (TMOS)', 'Silicon Carbide', 'Pure Quartz Sand', 'Silicone Rubber'],
      correctOption: 'Tetramethyl orthosilicate (TMOS)',
    },
    controlClues: {
      environmentConstraints: ['Supercritical CO₂ solvent exchange in an autoclave', 'Temperature above 31.1°C and pressure above 73.8 bar (CO₂ critical point)', 'Slow depressurization to prevent capillary collapse'],
      criticalHint: 'Drying must pass through the supercritical fluid phase where surface tension equals zero.',
      targetParameterKey: 'Select Drying Technique',
      validOptions: ['Supercritical Fluid Extraction', 'Oven Heat Bake at 200°C', 'Open Air Sun Drying', 'Microwave Heating'],
      correctOption: 'Supercritical Fluid Extraction',
    },
    synthesisMechanism: 'Supercritical drying eliminates liquid-vapor meniscus surface tension, leaving behind an intact 3D nanoporous silica skeleton with 99.8% porosity.',
    realWorldImpact: 'The world’s lowest-density solid material, used to insulate NASA Mars rovers and capture hypervelocity comet dust in space.',
  },

  // 10. Quantum Dot Synthesis (CdSe/ZnS)
  {
    id: 'collab-10',
    code: 'SYN-10',
    title: 'Colloidal Quantum Dot Emitter',
    targetProduct: 'CdSe/ZnS Core-Shell Semiconductor Nanocrystals',
    category: 'Advanced Materials',
    difficulty: 'Master',
    exploreClues: {
      reagents: ['Cadmium oxide dissolved in oleic acid', 'Selenium powder in trioctylphosphine (TOP:Se)', 'Zinc stearate shell precursor'],
      criticalHint: 'Fast nucleation injection followed by slower crystal growth precisely tunes nanocrystal diameter to 3.2 nm (green emission).',
      targetParameterKey: 'Target Quantum Core Diameter',
      validOptions: ['3.2 nm (Green Bandgap)', '500 nm (Microparticle)', '10 μm (Bulk Powder)', '1 mm (Macro Crystal)'],
      correctOption: '3.2 nm (Green Bandgap)',
    },
    controlClues: {
      environmentConstraints: ['Rapid hot injection at 300°C under dry argon', 'Immediate temperature drop to 260°C to halt new nucleation', 'Quench in cold toluene at 45 seconds'],
      criticalHint: 'A rapid temperature drop from 300°C to 260°C separates the nucleation event from growth, producing uniform quantum dots.',
      targetParameterKey: 'Select Thermal Quench Protocol',
      validOptions: ['Hot Injection 300°C → Growth 260°C', 'Constant 500°C Boil', 'Cold Soak at 0°C', 'Fluctuating Wave +/- 100°C'],
      correctOption: 'Hot Injection 300°C → Growth 260°C',
    },
    synthesisMechanism: 'Quantum confinement dictates the emission wavelength: decreasing particle diameter increases the quantum bandgap energy via particle-in-a-box physics.',
    realWorldImpact: 'Awarded the 2023 Nobel Prize in Chemistry (Bawendi, Brus, Ekimov); powers ultra-wide color gamut QLED televisions and biomedical cell markers.',
  },

  // 11. Photosynthetic Water Splitting
  {
    id: 'collab-11',
    code: 'SYN-11',
    title: 'Artificial Oxygen-Evolving Complex',
    targetProduct: '2H₂O + 4hν → O₂ + 4H⁺ + 4e⁻',
    category: 'Renewable Energy',
    difficulty: 'Elevated',
    exploreClues: {
      reagents: ['Cubane-like Mn₄CaO₅ cluster catalyst', 'Buffered aqueous electrolyte', 'Ruthenium polypyridyl photosensitizer dye'],
      criticalHint: 'The asymmetric calcium atom in the manganese-oxygen cubane is essential for binding the substrate water molecule.',
      targetParameterKey: 'Select Mimicked Biomimetic Core',
      validOptions: ['Mn₄CaO₅ Oxygen-Evolving Cluster', 'Pure Platinum Wire', 'Lead Oxide Sheet', 'Zinc Foil'],
      correctOption: 'Mn₄CaO₅ Oxygen-Evolving Cluster',
    },
    controlClues: {
      environmentConstraints: ['Irradiation with 450 nm blue LED light source', 'Anode potential held at +1.23 V vs RHE', 'pH buffered at neutral 7.0 with phosphate buffer'],
      criticalHint: 'Thermodynamic water oxidation requires a minimum theoretical electrochemical potential of +1.23 V.',
      targetParameterKey: 'Select Minimum Anodic Bias',
      validOptions: ['+1.23 V vs RHE (Thermodynamic Window)', '+0.1 V (Sub-threshold)', '+10.0 V (Extreme Overpotential)', '-1.5 V (Reducing Potential)'],
      correctOption: '+1.23 V vs RHE (Thermodynamic Window)',
    },
    synthesisMechanism: 'Photons excite the sensitizer, transferring electrons through four oxidation flash cycles (Kok cycle) to oxidize water into molecular oxygen.',
    realWorldImpact: 'The holy grail of clean renewable fuel: producing infinite clean hydrogen fuel from sunlight and ocean water.',
  },

  // 12. Carbon Nanotube Chemical Vapor Deposition
  {
    id: 'collab-12',
    code: 'SYN-12',
    title: 'Single-Walled Carbon Nanotubes (SWCNT)',
    targetProduct: 'Seamless Cylindrical Carbon Graphene Tubes',
    category: 'Advanced Materials',
    difficulty: 'Elevated',
    exploreClues: {
      reagents: ['Methane (CH₄) or Ethylene (C₂H₄) carbon precursor', 'Iron-Molybdenum nanoparticles on silica support', 'Hydrogen carrier gas'],
      criticalHint: 'Nanoparticle catalyst diameter determines the diameter and chirality of the growing single-walled carbon nanotube.',
      targetParameterKey: 'Select Supported Metal Catalyst',
      validOptions: ['Iron-Molybdenum (Fe-Mo) Nanoparticles', 'Gold Bullion Ingot', 'Mercury Liquid', 'Calcium Carbonate'],
      correctOption: 'Iron-Molybdenum (Fe-Mo) Nanoparticles',
    },
    controlClues: {
      environmentConstraints: ['Quartz tube furnace at 850°C', 'Total pressure at 1.0 atm with H₂/Ar carrier', 'Carbon precursor flow rate 15 sccm for 20 minutes'],
      criticalHint: 'Hydrocarbon pyrolysis and catalyst dissolution occur optimally at 850°C.',
      targetParameterKey: 'Select Furnace Temperature',
      validOptions: ['850°C Thermal CVD Window', '100°C Steam Heat', '3000°C Carbon Arc', 'Room Temp 25°C'],
      correctOption: '850°C Thermal CVD Window',
    },
    synthesisMechanism: 'Hydrocarbon gas cracks on the iron nanoparticle surface; carbon dissolves into the metal until supersaturated, precipitating outward as a seamless nanotube cylinder.',
    realWorldImpact: 'Possesses 100x the tensile strength of steel at one-sixth the weight, with ballistic electrical conductivity for post-silicon semiconductors.',
  },

  // 13. Vitamin C (Reichstein Process)
  {
    id: 'collab-13',
    code: 'SYN-13',
    title: 'L-Ascorbic Acid (Vitamin C)',
    targetProduct: 'C₆H₈O₆ (L-Ascorbic Acid)',
    category: 'Pharmaceutical',
    difficulty: 'Standard',
    exploreClues: {
      reagents: ['D-Glucose initial sugar source', 'Gluconobacter oxydans bacterial fermentation', 'Acetone solvent for acetonide protection'],
      criticalHint: 'Bacterial fermentation selectively oxidizes D-sorbitol to L-sorbose with 100% stereochemical retention.',
      targetParameterKey: 'Select Bio-Oxidation Agent',
      validOptions: ['Gluconobacter oxydans Bacteria', 'Bleach (Sodium Hypochlorite)', 'Nitric Acid', 'Sulfur Dioxide'],
      correctOption: 'Gluconobacter oxydans Bacteria',
    },
    controlClues: {
      environmentConstraints: ['Bioreactor aerated at 30°C with sterile air injection', 'Dissolved oxygen maintained above 40%', 'Acidic lactonization with concentrated HCl at 65°C'],
      criticalHint: 'Aerobic fermentation requires constant oxygen bubbling at gentle 30°C.',
      targetParameterKey: 'Select Fermentation Temperature',
      validOptions: ['30°C (Viable Microbial Growth)', '120°C Autoclave Sterilize', '-20°C Cryopreservation', '200°C Dry Oven'],
      correctOption: '30°C (Viable Microbial Growth)',
    },
    synthesisMechanism: 'Combined biological and chemical synthesis: glucose is reduced to sorbitol, bio-oxidized to sorbose, protected, and lactonized into enantiopure Vitamin C.',
    realWorldImpact: 'Tadeus Reichstein invented this in 1933; over 120,000 tons are manufactured each year as an essential nutrient and food antioxidant.',
  },

  // 14. Kevlar Synthesis
  {
    id: 'collab-14',
    code: 'SYN-14',
    title: 'Poly-paraphenylene terephthalamide (Kevlar)',
    targetProduct: '[-CO-C₆H₄-CO-NH-C₆H₄-NH-]ₙ (Kevlar Fibers)',
    category: 'Advanced Materials',
    difficulty: 'Elevated',
    exploreClues: {
      reagents: ['1,4-Phenylenediamine (para-diamine)', 'Terephthaloyl chloride (para-diacid chloride)', 'N-Methyl-2-pyrrolidone with calcium chloride'],
      criticalHint: 'Strict 1,4-para substitution produces completely straight, rigid rod polymer chains that align in liquid crystal solutions.',
      targetParameterKey: 'Select Monomer Isomer Symmetry',
      validOptions: ['1,4-Para Isomer (Rigid Rod)', '1,2-Ortho Isomer (Bent Kink)', '1,3-Meta Isomer (Flexible Ring)', 'Aliphatic Branched Chain'],
      correctOption: '1,4-Para Isomer (Rigid Rod)',
    },
    controlClues: {
      environmentConstraints: ['Concentrated sulfuric acid (100% H₂SO₄) solvent for wet-spinning', 'Spinneret extrusion into cold water coagulating bath at 5°C', 'Draw tension applied to align liquid crystalline domains'],
      criticalHint: 'Dry-jet wet spinning through concentrated sulfuric acid aligns the polymer chains along the fiber axis.',
      targetParameterKey: 'Select Spinning Solvent',
      validOptions: ['100% Concentrated Sulfuric Acid', 'Tap Water with Detergent', 'Acetone Nail Polish Remover', 'Vegetable Canola Oil'],
      correctOption: '100% Concentrated Sulfuric Acid',
    },
    synthesisMechanism: 'Aromatic condensation polymerization forms ultra-rigid polyamide chains packed together with inter-chain hydrogen bonds into bulletproof fibers.',
    realWorldImpact: 'Invented by Stephanie Kwolek in 1965 at DuPont; five times stronger than steel on an equal-weight basis, saving countless military and first-responder lives.',
  },

  // 15. Bio-Fermented Insulin
  {
    id: 'collab-15',
    code: 'SYN-15',
    title: 'Recombinant Human Insulin',
    targetProduct: '51-Amino Acid Two-Chain Insulin Peptide',
    category: 'Pharmaceutical',
    difficulty: 'Master',
    exploreClues: {
      reagents: ['Genetically engineered E. coli or Pichia pastoris yeast', 'Human proinsulin gene plasmid insert', 'Trypsin and Carboxypeptidase B cleavage enzymes'],
      criticalHint: 'Recombinant proinsulin contains a connecting C-peptide that must be cleaved cleanly to liberate the active A and B chains.',
      targetParameterKey: 'Select Recombinant Host Microorganism',
      validOptions: ['Engineered E. coli Expression Host', 'Wild Bacillus anthracis', 'Human Muscle Cell', 'Bovine Pancreas Extract'],
      correctOption: 'Engineered E. coli Expression Host',
    },
    controlClues: {
      environmentConstraints: ['Fermentation at 37°C in glucose-rich nutrient broth', 'In vitro oxidative disulfide bond folding buffer at pH 8.6 with glutathione', 'Reverse-phase HPLC purification to 99.9% purity'],
      criticalHint: 'The three specific disulfide bonds (two interchain, one intrachain) fold correctly only in a controlled redox glutathione buffer at pH 8.6.',
      targetParameterKey: 'Select Disulfide Folding Buffer pH',
      validOptions: ['pH 8.6 Redox Glutathione Buffer', 'pH 1.0 Concentrated Acid', 'pH 13.0 Caustic Soda', 'pH 5.0 Citric Slurry'],
      correctOption: 'pH 8.6 Redox Glutathione Buffer',
    },
    synthesisMechanism: 'Synthetic DNA is expressed in bacterial fermenters; isolated proinsulin is refolded with correct disulfide crosslinks, and enzymatic digestion yields pure human insulin.',
    realWorldImpact: 'Developed by Genentech in 1978 as the first approved recombinant DNA medicine, replacing animal pancreas extracts for hundreds of millions of diabetic patients.',
  },

  // 16. Perovskite Solar Cell Crystals (MAPbI3)
  {
    id: 'collab-16',
    code: 'SYN-16',
    title: 'Methylammonium Lead Iodide Perovskite',
    targetProduct: 'CH₃NH₃PbI₃ Photovoltaic Crystal',
    category: 'Renewable Energy',
    difficulty: 'Elevated',
    exploreClues: {
      reagents: ['Lead(II) iodide (PbI₂) bright yellow powder', 'Methylammonium iodide (MAI: CH₃NH₃I)', 'Dimethylformamide (DMF) solvent'],
      criticalHint: 'The ABX₃ crystal structure self-assembles when organic methylammonium cations occupy the central voids of PbI₆ octahedra.',
      targetParameterKey: 'Select Crystal Lattice Form',
      validOptions: ['ABX₃ Perovskite Crystal Cage', 'Amorphous Glass', 'Hexagonal Graphite Layer', 'Metallic Solder Sphere'],
      correctOption: 'ABX₃ Perovskite Crystal Cage',
    },
    controlClues: {
      environmentConstraints: ['Spin-coat at 4000 rpm inside an argon glovebox', 'Anti-solvent dripping with chlorobenzene at second 15', 'Thermal annealing on hotplate at 100°C for 10 minutes'],
      criticalHint: 'Dripping an anti-solvent (chlorobenzene) during rapid spin-coating induces instantaneous supersaturation and smooth mirror-like crystal film growth.',
      targetParameterKey: 'Select Anti-Solvent Quench Timing',
      validOptions: ['Anti-Solvent Drip at 15 Seconds', 'Bake at 500°C Immediately', 'Wash with Water Stream', 'Leave Wet for 3 Weeks'],
      correctOption: 'Anti-Solvent Drip at 15 Seconds',
    },
    synthesisMechanism: 'Solution-processed chemical coordination: solvent extraction drives instantaneous crystallization of the black semiconductor perovskite phase with 1.55 eV optical bandgap.',
    realWorldImpact: 'The fastest-advancing solar technology in human history, surging from 3.8% efficiency in 2009 to over 26% today, promising ultra-cheap roll-to-roll clean energy.',
  },

  // 17. Polyethylene Catalysis (Ziegler-Natta)
  {
    id: 'collab-17',
    code: 'SYN-17',
    title: 'High-Density Polyethylene (HDPE)',
    targetProduct: '[-CH₂-CH₂-]ₙ (Unbranched Linear HDPE)',
    category: 'Advanced Materials',
    difficulty: 'Standard',
    exploreClues: {
      reagents: ['Pure Ethylene gas (C₂H₄)', 'Titanium tetrachloride (TiCl₄) catalyst', 'Triethylaluminum [Al(C₂H₅)₃] co-catalyst'],
      criticalHint: 'The coordinated titanium center coordinates incoming ethylene monomers, polymerizing them with zero side branching.',
      targetParameterKey: 'Select Polymerization Catalyst',
      validOptions: ['Ziegler-Natta (TiCl₄ / AlEt₃)', 'Baking Soda', 'Sulfuric Acid', 'Table Salt'],
      correctOption: 'Ziegler-Natta (TiCl₄ / AlEt₃)',
    },
    controlClues: {
      environmentConstraints: ['Low pressure (1 to 5 atm)—no extreme autoclaves needed!', 'Reaction temperature maintained between 70°C and 80°C in hexane diluent', 'Absolute exclusion of oxygen and water (pyrophoric catalyst!)'],
      criticalHint: 'Karl Ziegler won the Nobel Prize for discovering that titanium catalysts polymerize ethylene at gentle atmospheric pressure instead of 2000 atm.',
      targetParameterKey: 'Select Operating Pressure Regime',
      validOptions: ['Low Pressure (1 - 5 atm)', 'Ultra-High 3000 atm Autoclave', 'Deep Vacuum 0.001 mbar', 'Underwater 200 bar'],
      correctOption: 'Low Pressure (1 - 5 atm)',
    },
    synthesisMechanism: 'Coordination insertion polymerization (Cossee-Arlman mechanism): ethylene coordinates to the vacant titanium orbital and inserts into the Ti-carbon bond.',
    realWorldImpact: 'Over 100 million tons of HDPE are produced each year for water distribution pipes, medical prosthetics, food containers, and durable corrosion-proof tanks.',
  },

  // 18. Artificial Photosynthetic Methanol (CO2 to Liquid Fuel)
  {
    id: 'collab-18',
    code: 'SYN-18',
    title: 'Direct CO₂ Hydrogenation to Methanol',
    targetProduct: 'CO₂ + 3H₂ ⇌ CH₃OH + H₂O',
    category: 'Renewable Energy',
    difficulty: 'Elevated',
    exploreClues: {
      reagents: ['Captured atmospheric CO₂ gas', 'Green hydrogen from solar electrolysis', 'Copper-Zinc Oxide-Alumina (Cu/ZnO/Al₂O₃) catalyst'],
      criticalHint: 'Active Cu-ZnO dual sites activate carbon dioxide and split molecular hydrogen cooperatively.',
      targetParameterKey: 'Select Ternary Catalyst',
      validOptions: ['Cu/ZnO/Al₂O₃ Ternary Catalyst', 'Pure Lead Shot', 'Activated Charcoal Alone', 'Iron Rust Flakes'],
      correctOption: 'Cu/ZnO/Al₂O₃ Ternary Catalyst',
    },
    controlClues: {
      environmentConstraints: ['Fixed-bed reactor pressure held at 50 bar', 'Temperature regulated at 240°C', 'Recycle unreacted syngas to achieve >95% cumulative conversion'],
      criticalHint: 'Operating at 50 bar and 240°C balances exothermic Le Chatelier equilibrium against kinetic reaction velocity.',
      targetParameterKey: 'Select Reactor Equilibrium State',
      validOptions: ['50 bar and 240°C', '1 bar and 0°C', '500 bar and 1000°C', 'Vacuum and 50°C'],
      correctOption: '50 bar and 240°C',
    },
    synthesisMechanism: 'Formate pathway hydrogenation: carbon dioxide coordinates to zinc oxide vacancies and is sequentially hydrogenated into methoxy intermediates and methanol.',
    realWorldImpact: 'Converts harmful industrial carbon emissions directly into a storable, clean liquid shipping fuel and universal chemical feedstock.',
  },

  // 19. Superconducting YBCO Ceramics
  {
    id: 'collab-19',
    code: 'SYN-19',
    title: 'Yttrium Barium Copper Oxide (YBCO Superconductor)',
    targetProduct: 'YBa₂Cu₃O₇₋ₓ (High-Tc Superconductor)',
    category: 'Advanced Materials',
    difficulty: 'Master',
    exploreClues: {
      reagents: ['Yttrium oxide (Y₂O₃)', 'Barium carbonate (BaCO₃)', 'Copper(II) oxide (CuO) in precise 1:2:3 cation molar ratio'],
      criticalHint: 'The stoichiometric ratio of metals must be precisely 1 Yttrium to 2 Barium to 3 Copper (the "1-2-3" phase).',
      targetParameterKey: 'Target Metal Stoichiometry',
      validOptions: ['1:2:3 (Y:Ba:Cu)', '1:1:1 Equimolar', '3:2:1 Inverted', '1:4:8 High Copper'],
      correctOption: '1:2:3 (Y:Ba:Cu)',
    },
    controlClues: {
      environmentConstraints: ['Sintering in a tube furnace at 930°C for 24 hours', 'Slow furnace cool in pure oxygen atmosphere at 450°C for 12 hours', 'Oxygen uptake must achieve 7-x ≈ 6.93 oxygen atoms per unit cell'],
      criticalHint: 'Superconductivity above liquid nitrogen temperature occurs only when oxygen annealing fills the Cu-O chain layers (x < 0.1).',
      targetParameterKey: 'Select Oxygen Annealing Step',
      validOptions: ['Slow 450°C Pure O₂ Anneal (x < 0.1)', 'Fast Nitrogen Quench to Cold', 'Hydrogen Blast at 800°C', 'Room Air Fan Cool'],
      correctOption: 'Slow 450°C Pure O₂ Anneal (x < 0.1)',
    },
    synthesisMechanism: 'Solid-state reaction creates a layered perovskite crystal lattice containing 2D copper-oxygen planes where electrons form Cooper pairs and flow with zero electrical resistance.',
    realWorldImpact: 'The first material discovered (in 1987) to superconduct above the boiling point of liquid nitrogen (77 K), enabling magnetic levitation trains and compact fusion reactor magnets.',
  },

  // 20. Taxol Total Synthesis (Paclitaxel)
  {
    id: 'collab-20',
    code: 'SYN-20',
    title: 'Paclitaxel (Taxol Oncology Core)',
    targetProduct: 'C₄₇H₅₁NO₁₄ (Paclitaxel Oncology Molecule)',
    category: 'Pharmaceutical',
    difficulty: 'Master',
    exploreClues: {
      reagents: ['10-Deacetylbaccatin III (extracted from renewable yew needles)', 'Synthetic beta-lactam phenylisoserine sidechain', 'Dicyclohexylcarbodiimide (DCC) coupling reagent'],
      criticalHint: 'Semi-synthesis coupling attaches the complex phenylisoserine sidechain to the C-13 hydroxyl of the baccatin core.',
      targetParameterKey: 'Select Renewable Biosynthetic Core',
      validOptions: ['10-Deacetylbaccatin III (10-DAB)', 'Pure Petroleum Naphtha', 'Cellulose Pulp', 'Coal Tar Pitch'],
      correctOption: '10-Deacetylbaccatin III (10-DAB)',
    },
    controlClues: {
      environmentConstraints: ['Coupling reaction conducted at 25°C under dry argon in dichloromethane', 'Mild deprotection with dilute hydrofluoric acid/pyridine at 0°C', 'Recrystallization from aqueous ethanol'],
      criticalHint: 'Deprotection must use mild fluoride reagents to avoid cleaving the fragile oxetane four-membered ring.',
      targetParameterKey: 'Select Oxetane-Safe Deprotection',
      validOptions: ['Mild Fluoride / Pyridine at 0°C', 'Boiling Concentrated Nitric Acid', 'Caustic Soda Reflux at 100°C', 'Direct Flame Toast'],
      correctOption: 'Mild Fluoride / Pyridine at 0°C',
    },
    synthesisMechanism: 'Stereoselective esterification joins the phenylisoserine sidechain to the tetracyclic diterpene core, assembling the microtubule-stabilizing anticancer agent.',
    realWorldImpact: 'One of the most powerful and widely prescribed chemotherapy drugs for ovarian, breast, and lung cancer in medical history.',
  },
];

export function getCollaborativeChallengeById(id: string): CollaborativeChallenge | undefined {
  return COLLABORATIVE_CHALLENGES.find((c) => c.id === id);
}
