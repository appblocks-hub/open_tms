import scC4cAgreementAppHtml from '../terms/sc_c4c_term.js';
import gcTermAppHtml from '../terms/gc_term.js';
import purchaseAgreement from '../terms/purchase-agreement.js';

async function agreements(prisma) {
  const created_by = '06baffa8-2b8f-4214-b4d2-8f5275518ab9';
  // sc seed
  await prisma.terms.createMany({
    data: [
      {
        name: 'sc&c4c',
        text: 'Offer to Sell Receivables',
        app_html: scC4cAgreementAppHtml,
        pdf_html: purchaseAgreement,
        version_no: 1.0,
        created_by,
      },
      {
        name: 'gc',
        text: 'Offer to Sell Receivables',
        app_html: gcTermAppHtml,
        version_no: 1.0,
        created_by,
      },
    ],
  });
}

export default agreements;
