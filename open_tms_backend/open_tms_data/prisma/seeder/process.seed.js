async function processAndOffers(prisma) {
  const created_by = '06baffa8-2b8f-4214-b4d2-8f5275518ab9';
  await prisma.$transaction(async (tx) => {
    const process = await tx.process.create({
      data: {
        id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        name: 'AR_LC',
        display_name: 'Account receivable life cycle',
        created_by,
      },
    });
    // stage
    await tx.stage.createMany({
      data: [
        {
          id: 'e6443e5d-8a02-49b5-b40d-fb2d7f50333b',
          name: 'draft',
          display_name: 'Draft',
          created_by,
          is_start: true,
          is_end: false,
          process_id: process.id,
        },
        {
          id: '6046ac0c-19d4-4e11-b487-a73e8bd34444',
          name: 'withdraw',
          display_name: 'Withdraw',
          created_by,
          is_start: false,
          is_end: false,
          process_id: process.id,
        },
        {
          id: '56b1f8aa-6684-4f63-a6a0-9baf580ca2d9',
          name: 'pending_gc_approval',
          display_name: 'Pending gc approval',
          created_by,
          is_start: false,
          is_end: false,
          process_id: process.id,
        },
        {
          id: 'cfe4ae7e-51f8-4e4c-acc9-55450e308f49',
          name: 'gc_approved',
          display_name: 'Gc approved',
          created_by,
          is_start: false,
          is_end: false,
          process_id: process.id,
        },
        {
          id: 'c1488d16-223a-4085-ac25-15ef336c0337',
          name: 'gc_rejected',
          display_name: 'Gc rejected',
          created_by,
          is_start: false,
          is_end: true,
          process_id: process.id,
        },
        {
          id: '4d5ce0dd-2c54-43ef-ad62-b259243187e3',
          name: 'pending_c4c_approval',
          display_name: 'Pending c4c approval',
          created_by,
          is_start: false,
          is_end: true,
          process_id: process.id,
        },
        {
          id: '4137ecad-6621-4311-89e4-cd09ea51276a',
          name: 'c4c_approved',
          display_name: 'c4c approved',
          created_by,
          is_start: false,
          is_end: false,
          process_id: process.id,
        },
        {
          id: '2b649864-8900-40ec-8dd7-5e6333568848',
          name: 'c4c_rejected',
          display_name: 'c4c rejected',
          created_by,
          is_start: false,
          is_end: true,
          process_id: process.id,
        },
        {
          id: '87f4c4dd-8567-4f22-85ca-04d202f8ff39',
          name: 'sc_payment_processing', // sc payment processing
          display_name: 'Payment Processing',
          created_by,
          is_start: false,
          is_end: false,
          process_id: process.id,
        },
        {
          id: '9c18bd00-04c3-4ed6-8c16-739d2f620e1c',
          name: 'payment_completed',
          display_name: 'Sc payment completed', // sc payment completed
          created_by,
          is_start: false,
          is_end: false,
          process_id: process.id,
        },
        {
          id: 'cc3dcb37-6381-4cd5-83db-a6e642aeebb3',
          name: 'repayment_completed',
          display_name: 'Repayment Completed',
          created_by,
          is_start: false,
          is_end: false,
          process_id: process.id,
        },
        {
          id: '658a0805-9085-4d6a-87a0-6c9183e676a4',
          name: 'completed',
          display_name: 'Completed',
          created_by,
          is_start: false,
          is_end: false,
          process_id: process.id,
        },
      ],
    });

    //process_path
    await tx.process_path.createMany({
      data: [
        {
          name: 'draft_to_pending_gc',
          display_name: 'Draft to pending gc',
          created_by,
          from_stage: 'e6443e5d-8a02-49b5-b40d-fb2d7f50333b', // draft
          to_stage: '56b1f8aa-6684-4f63-a6a0-9baf580ca2d9', // pending gc
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'pending_to_gc_approve',
          display_name: 'pending_to_gc_approve',
          created_by,
          from_stage: '56b1f8aa-6684-4f63-a6a0-9baf580ca2d9', // pending
          to_stage: 'cfe4ae7e-51f8-4e4c-acc9-55450e308f49', // gc approve
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'pending_to_withdraw',
          display_name: 'pending_to_withdraw',
          created_by,
          from_stage: '56b1f8aa-6684-4f63-a6a0-9baf580ca2d9', // pending
          to_stage: '6046ac0c-19d4-4e11-b487-a73e8bd34444', // withdraw
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'pending_to_gc_reject',
          display_name: 'pending_to_gc_reject',
          created_by,
          from_stage: '56b1f8aa-6684-4f63-a6a0-9baf580ca2d9', // pending
          to_stage: 'c1488d16-223a-4085-ac25-15ef336c0337', // gc reject
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'gc_reject_to_draft',
          display_name: 'gc_reject_to_draft',
          created_by,
          from_stage: 'c1488d16-223a-4085-ac25-15ef336c0337', // gc reject
          to_stage: 'e6443e5d-8a02-49b5-b40d-fb2d7f50333b', // draft
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'gc_approve_to_pending_c4c',
          display_name: 'gc_approve_to_pending_c4c',
          created_by,
          from_stage: 'cfe4ae7e-51f8-4e4c-acc9-55450e308f49', //gc approve
          to_stage: '4d5ce0dd-2c54-43ef-ad62-b259243187e3', // pending c4c
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'pending_c4c_to_c4c_apporve',
          display_name: 'pending_c4c_to_c4c_apporve',
          created_by,
          from_stage: '4d5ce0dd-2c54-43ef-ad62-b259243187e3', // pending c4c
          to_stage: '4137ecad-6621-4311-89e4-cd09ea51276a', // c4c approve
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'pending_c4c_to_c4c_reject',
          display_name: 'pending_c4c_to_c4c_reject',
          created_by,
          from_stage: '4d5ce0dd-2c54-43ef-ad62-b259243187e3', //pending c4c
          to_stage: '2b649864-8900-40ec-8dd7-5e6333568848', // c4c reject
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'c4c_reject_draft',
          display_name: 'c4c_reject_draft',
          created_by,
          from_stage: '2b649864-8900-40ec-8dd7-5e6333568848', // c4c reject
          to_stage: 'e6443e5d-8a02-49b5-b40d-fb2d7f50333b', // draft
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'c4c_approved_to_c4c_payment_processing',
          display_name: 'c4c_approved_to_c4c_payment_processing',
          created_by,
          from_stage: '4137ecad-6621-4311-89e4-cd09ea51276a', // c4c approve
          to_stage: '87f4c4dd-8567-4f22-85ca-04d202f8ff39', // c4c payment processing
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'c4c_payment_processing_to_sc_payment_complete',
          display_name: 'c4c_payment_processing_to_sc_payment_complete',
          created_by,
          from_stage: '87f4c4dd-8567-4f22-85ca-04d202f8ff39', // c4c payment processing
          to_stage: '9c18bd00-04c3-4ed6-8c16-739d2f620e1c', // sc payment completed
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'c4c_payment_complete_to_repayment_completed',
          display_name: 'c4c_payment_complete_to_repayment_completed',
          created_by,
          from_stage: '9c18bd00-04c3-4ed6-8c16-739d2f620e1c', //sc payment complete
          to_stage: 'cc3dcb37-6381-4cd5-83db-a6e642aeebb3', // repayment completed
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
        {
          name: 'repayment_completed_completed',
          display_name: 'repayment_completed_completed',
          created_by,
          from_stage: 'cc3dcb37-6381-4cd5-83db-a6e642aeebb3', //repayment completed
          to_stage: '658a0805-9085-4d6a-87a0-6c9183e676a4', // completed
          process_id: '85f24cda-e736-4a2b-ae4c-e36d682f0cf4',
        },
      ],
    });

    // offer
    const timestamp = '2023-05-08T06:45:13.673Z';

    await tx.offers.createMany({
      data: [
        {
          payment_mode: 'ACH',
          offer_type: 6,
          rate: 10,
        },
        {
          payment_mode: 'ACH',
          offer_type: 7,
          rate: 5,
        },
        {
          payment_mode: 'Check',
          offer_type: 6,
          rate: 10,
        },
        {
          payment_mode: 'Check',
          offer_type: 7,
          rate: 50,
        },
        {
          payment_mode: 'ACH',
          offer_type: 1,
          rate: 20,
          offer_period: 30,
          start_at: timestamp,
        },
        {
          payment_mode: 'ACH',
          offer_type: 1,
          rate: 10,
          offer_period: 30,
          start_at: timestamp,
        },
        {
          payment_mode: 'ACH',
          offer_type: 1,
          rate: 0,
          offer_period: 30,
          start_at: timestamp,
        },
        {
          payment_mode: 'ACH',
          offer_type: 4,
          rate: 1,
          offer_period: 30,
          start_at: timestamp,
        },
        {
          payment_mode: 'Check',
          offer_type: 1,
          rate: 20,
          offer_period: 30,
          start_at: timestamp,
        },
        {
          payment_mode: 'Check',
          offer_type: 1,
          rate: 10,
          offer_period: 30,
          start_at: timestamp,
        },
        {
          payment_mode: 'Check',
          offer_type: 1,
          rate: 0,
          offer_period: 30,
          start_at: timestamp,
        },
        {
          payment_mode: 'Check',
          offer_type: 4,
          rate: 1,
          start_at: timestamp,
        },
      ],
    });
  });
}

export default processAndOffers;
