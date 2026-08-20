import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

import {
  getWeeklyReport,
} from './report.service';

type ReportGroupValue =
  | 'EXTERNAL_PERSONNEL'
  | 'FACTORY_SUGAR_WAREHOUSE'
  | 'ADMINISTRATION_FIELD'
  | 'CORPORATE_PERSONNEL'
  | 'PRACTITIONERS'
  | 'FACTORY_LABORATORY'
  | 'HR_SAFETY_TRAINING';

function serviceLabel(
  service: 'BREAKFAST' | 'LUNCH',
) {
  return service === 'BREAKFAST'
    ? 'DESAYUNO'
    : 'COMIDA';
}

function reportGroupLabel(
  reportGroup: ReportGroupValue,
) {
  switch (reportGroup) {
    case 'EXTERNAL_PERSONNEL':
      return 'PERSONAL EXTERNO';

    case 'FACTORY_SUGAR_WAREHOUSE':
      return 'FÁBRICA Y BODEGA DE AZÚCAR';

    case 'ADMINISTRATION_FIELD':
      return 'ADMINISTRACIÓN Y CAMPO';

    case 'CORPORATE_PERSONNEL':
      return 'PERSONAL CORPORATIVO';

    case 'PRACTITIONERS':
      return 'PRACTICANTES';

    case 'FACTORY_LABORATORY':
      return 'LABORATORIO DE FÁBRICA';

    case 'HR_SAFETY_TRAINING':
      return 'CAPITAL HUMANO, SEGURIDAD Y CAPACITACIÓN';
  }
}

function formatDate(
  value: string,
) {
  const date = new Date(
    `${value}T00:00:00.000Z`,
  );

  return date.toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    },
  );
}

/*
 * Obtiene únicamente las filas
 * pertenecientes al grupo seleccionado.
 */
function filterReportRows(
  report: Awaited<
    ReturnType<typeof getWeeklyReport>
  >,
  reportGroup: ReportGroupValue,
) {
  /*
   * El reporte semanal ya debe contener
   * reportGroup en cada fila.
   */
  return report.rows.filter(
    row =>
      row.reportGroup ===
      reportGroup,
  );
}

/*
 * Calcula los totales únicamente
 * del área seleccionada.
 */
function calculateTotals(
  rows: ReturnType<
    typeof filterReportRows
  >,
) {
  const people =
    new Set(
      rows.map(row =>
        `${row.employeeNumber}-${row.name}`,
      ),
    );

  let breakfast = 0;
  let lunch = 0;

  for (const row of rows) {
    const total =
      [
        row.monday,
        row.tuesday,
        row.wednesday,
        row.thursday,
        row.friday,
        row.saturday,
      ].filter(value => value === 'X')
        .length;

    if (
      row.service ===
      'BREAKFAST'
    ) {
      breakfast += total;
    }

    if (
      row.service ===
      'LUNCH'
    ) {
      lunch += total;
    }
  }

  return {
    people: people.size,
    breakfast,
    lunch,
    total:
      breakfast + lunch,
  };
}

/*
 * =================================
 * EXCEL
 * =================================
 */
export async function generateWeeklyExcel(
  startDate: string,
  reportGroup: ReportGroupValue,
) {
  const report =
    await getWeeklyReport(
      startDate,
    );

  const rows =
    filterReportRows(
      report,
      reportGroup,
    );

  const totals =
    calculateTotals(rows);

  const areaName =
    reportGroupLabel(
      reportGroup,
    );

  const workbook =
    new ExcelJS.Workbook();

  workbook.creator =
    'Comedor Digital Atencingo';

  workbook.created =
    new Date();

  const worksheet =
    workbook.addWorksheet(
      'Reporte semanal',
      {
        pageSetup: {
          orientation: 'landscape',
          paperSize: 9,
          fitToPage: true,
          fitToWidth: 1,
          fitToHeight: 0,
        },
      },
    );

  /*
   * Anchos de columnas.
   */
  worksheet.columns = [
    {
      key: 'employeeNumber',
      width: 15,
    },
    {
      key: 'name',
      width: 34,
    },
    {
      key: 'service',
      width: 18,
    },
    {
      key: 'monday',
      width: 14,
    },
    {
      key: 'tuesday',
      width: 14,
    },
    {
      key: 'wednesday',
      width: 14,
    },
    {
      key: 'thursday',
      width: 14,
    },
    {
      key: 'friday',
      width: 14,
    },
    {
      key: 'saturday',
      width: 14,
    },
  ];

  /*
   * =================================
   * ENCABEZADO INSTITUCIONAL
   * =================================
   */

  worksheet.mergeCells(
    'A1:I1',
  );

  worksheet.getCell('A1').value =
    'INDUSTRIAL AZUCARERA ATENCINGO, S.A. DE C.V.';

  worksheet.getCell('A1').font = {
    bold: true,
    size: 15,
  };

  worksheet.getCell(
    'A1',
  ).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };

  worksheet.getRow(1).height =
    25;

  worksheet.mergeCells(
    'A2:I2',
  );

  worksheet.getCell('A2').value =
    'COMEDOR DIGITAL ATENCINGO';

  worksheet.getCell('A2').font = {
    bold: true,
    size: 13,
  };

  worksheet.getCell(
    'A2',
  ).alignment = {
    horizontal: 'center',
    vertical: 'middle',
  };

  worksheet.mergeCells(
    'A3:I3',
  );

  worksheet.getCell('A3').value =
    `ÁREA: ${areaName}`;

  worksheet.getCell('A3').font = {
    bold: true,
    size: 11,
  };

  worksheet.getCell(
    'A3',
  ).alignment = {
    horizontal: 'center',
  };

  worksheet.mergeCells(
    'A4:I4',
  );

  worksheet.getCell('A4').value =
    `PERIODO: DEL ${formatDate(
      report.week.startDate,
    )} AL ${formatDate(
      report.week.endDate,
    )}`;

  worksheet.getCell('A4').font = {
    bold: true,
    size: 10,
  };

  worksheet.getCell(
    'A4',
  ).alignment = {
    horizontal: 'center',
  };

  /*
   * =================================
   * ENCABEZADOS DE TABLA
   * =================================
   */

  const headerRow =
    worksheet.getRow(6);

  headerRow.values = [
    'NÚM. TRAB.',
    'NOMBRE',
    'DESAYUNO / COMIDA',
    `LUNES\n${formatDate(
      report.week.days.monday,
    )}`,
    `MARTES\n${formatDate(
      report.week.days.tuesday,
    )}`,
    `MIÉRCOLES\n${formatDate(
      report.week.days.wednesday,
    )}`,
    `JUEVES\n${formatDate(
      report.week.days.thursday,
    )}`,
    `VIERNES\n${formatDate(
      report.week.days.friday,
    )}`,
    `SÁBADO\n${formatDate(
      report.week.days.saturday,
    )}`,
  ];

  headerRow.height = 42;

  headerRow.eachCell(cell => {
    cell.font = {
      bold: true,
      size: 10,
    };

    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FFE7F3E9',
      },
    };

    cell.border = {
      top: {
        style: 'thin',
      },
      left: {
        style: 'thin',
      },
      bottom: {
        style: 'thin',
      },
      right: {
        style: 'thin',
      },
    };
  });

  /*
   * =================================
   * FILAS
   * =================================
   */

  for (const row of rows) {
    const excelRow =
      worksheet.addRow([
        row.employeeNumber ||
          '',
        row.name,
        serviceLabel(
          row.service,
        ),
        row.monday,
        row.tuesday,
        row.wednesday,
        row.thursday,
        row.friday,
        row.saturday,
      ]);

    excelRow.height = 28;

    excelRow.eachCell(
      (
        cell,
        columnNumber,
      ) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal:
            columnNumber === 2
              ? 'left'
              : 'center',
          wrapText: true,
        };

        cell.border = {
          top: {
            style: 'thin',
            color: {
              argb:
                'FFBFC5C0',
            },
          },
          left: {
            style: 'thin',
            color: {
              argb:
                'FFBFC5C0',
            },
          },
          bottom: {
            style: 'thin',
            color: {
              argb:
                'FFBFC5C0',
            },
          },
          right: {
            style: 'thin',
            color: {
              argb:
                'FFBFC5C0',
            },
          },
        };

        if (
          columnNumber >= 4 &&
          cell.value === 'X'
        ) {
          cell.font = {
            bold: true,
            size: 14,
            color: {
              argb:
                'FF2E7D32',
            },
          };
        }
      },
    );
  }

  /*
   * Si no existen registros.
   */
  if (rows.length === 0) {
    worksheet.mergeCells(
      'A7:I7',
    );

    worksheet.getCell(
      'A7',
    ).value =
      'No existen servicios registrados para esta área durante el periodo seleccionado.';

    worksheet.getCell(
      'A7',
    ).alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };

    worksheet.getCell(
      'A7',
    ).font = {
      italic: true,
      size: 10,
    };

    worksheet.getRow(7).height =
      35;
  }

  /*
   * =================================
   * RESUMEN
   * =================================
   */

  const summaryStart =
    worksheet.rowCount + 2;

  worksheet.getCell(
    `A${summaryStart}`,
  ).value = 'RESUMEN';

  worksheet.getCell(
    `A${summaryStart}`,
  ).font = {
    bold: true,
    size: 11,
  };

  worksheet.getCell(
    `A${summaryStart + 1}`,
  ).value = 'Personas';

  worksheet.getCell(
    `B${summaryStart + 1}`,
  ).value =
    totals.people;

  worksheet.getCell(
    `A${summaryStart + 2}`,
  ).value = 'Desayunos';

  worksheet.getCell(
    `B${summaryStart + 2}`,
  ).value =
    totals.breakfast;

  worksheet.getCell(
    `A${summaryStart + 3}`,
  ).value = 'Comidas';

  worksheet.getCell(
    `B${summaryStart + 3}`,
  ).value =
    totals.lunch;

  worksheet.getCell(
    `A${summaryStart + 4}`,
  ).value =
    'Total de servicios';

  worksheet.getCell(
    `B${summaryStart + 4}`,
  ).value =
    totals.total;

  /*
   * Congelar encabezado.
   */
  worksheet.views = [
    {
      state: 'frozen',
      ySplit: 6,
    },
  ];

  /*
   * Configuración de impresión.
   */
  worksheet.pageSetup.margins = {
    left: 0.25,
    right: 0.25,
    top: 0.5,
    bottom: 0.5,
    header: 0.2,
    footer: 0.2,
  };

  const buffer =
    await workbook.xlsx.writeBuffer();

  return Buffer.from(buffer);
}

/*
 * =================================
 * PDF
 * =================================
 */
export async function generateWeeklyPdf(
  startDate: string,
  reportGroup: ReportGroupValue,
) {
  const report =
    await getWeeklyReport(
      startDate,
    );

  const rows =
    filterReportRows(
      report,
      reportGroup,
    );

  const totals =
    calculateTotals(rows);

  const areaName =
    reportGroupLabel(
      reportGroup,
    );

  return new Promise<Buffer>(
    (
      resolve,
      reject,
    ) => {
      try {
        const document =
          new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margin: 25,
          });

        const chunks: Buffer[] =
          [];

        document.on(
          'data',
          chunk => {
            chunks.push(
              Buffer.from(chunk),
            );
          },
        );

        document.on(
          'end',
          () => {
            resolve(
              Buffer.concat(
                chunks,
              ),
            );
          },
        );

        document.on(
          'error',
          reject,
        );

        /*
         * =================================
         * ENCABEZADO
         * =================================
         */

        document
          .font('Helvetica-Bold')
          .fontSize(13)
          .text(
            'INDUSTRIAL AZUCARERA ATENCINGO, S.A. DE C.V.',
            {
              align: 'center',
            },
          );

        document
          .fontSize(11)
          .text(
            'COMEDOR DIGITAL ATENCINGO',
            {
              align: 'center',
            },
          );

        document
          .moveDown(0.3);

        document
          .font('Helvetica-Bold')
          .fontSize(9)
          .text(
            `ÁREA: ${areaName}`,
            {
              align: 'center',
            },
          );

        document
          .font('Helvetica')
          .fontSize(9)
          .text(
            `PERIODO: DEL ${formatDate(
              report.week.startDate,
            )} AL ${formatDate(
              report.week.endDate,
            )}`,
            {
              align: 'center',
            },
          );

        document.moveDown(1);

        /*
         * =================================
         * TABLA
         * =================================
         */

        const startX = 25;

        let currentY =
          document.y;

        const rowHeight = 28;

        const widths = [
          58,
          150,
          78,
          67,
          67,
          67,
          67,
          67,
          67,
        ];

        const headers = [
          'Núm. Trab.',
          'Nombre',
          'Desayuno / Comida',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ];

        function drawCell(
          text: string,
          x: number,
          y: number,
          width: number,
          height: number,
          bold = false,
          center = true,
        ) {
          document
            .rect(
              x,
              y,
              width,
              height,
            )
            .stroke(
              '#B7BDB8',
            );

          document
            .font(
              bold
                ? 'Helvetica-Bold'
                : 'Helvetica',
            )
            .fontSize(7.2)
            .fillColor(
              '#1B1B1B',
            )
            .text(
              text,
              x + 3,
              y + 7,
              {
                width:
                  width - 6,
                height:
                  height - 6,
                align:
                  center
                    ? 'center'
                    : 'left',
              },
            );
        }

        /*
         * Encabezados.
         */
        let x = startX;

        headers.forEach(
          (
            header,
            index,
          ) => {
            drawCell(
              header,
              x,
              currentY,
              widths[index]!,
              rowHeight,
              true,
            );

            x +=
              widths[index]!;
          },
        );

        currentY += rowHeight;

        /*
         * Filas.
         */
        for (const row of rows) {
          if (
            currentY > 545
          ) {
            document.addPage({
              size: 'A4',
              layout:
                'landscape',
              margin: 25,
            });

            currentY = 35;

            let headerX =
              startX;

            headers.forEach(
              (
                header,
                index,
              ) => {
                drawCell(
                  header,
                  headerX,
                  currentY,
                  widths[index]!,
                  rowHeight,
                  true,
                );

                headerX +=
                  widths[index]!;
              },
            );

            currentY +=
              rowHeight;
          }

          const values = [
            row.employeeNumber ||
              '',
            row.name,
            serviceLabel(
              row.service,
            ),
            row.monday,
            row.tuesday,
            row.wednesday,
            row.thursday,
            row.friday,
            row.saturday,
          ];

          let rowX =
            startX;

          values.forEach(
            (
              value,
              index,
            ) => {
              drawCell(
                value,
                rowX,
                currentY,
                widths[index]!,
                rowHeight,
                value === 'X',
                index !== 1,
              );

              rowX +=
                widths[index]!;
            },
          );

          currentY +=
            rowHeight;
        }

        /*
         * Sin registros.
         */
        if (rows.length === 0) {
          document
            .font('Helvetica')
            .fontSize(9)
            .fillColor(
              '#555555',
            )
            .text(
              'No existen servicios registrados para esta área durante el periodo seleccionado.',
              startX,
              currentY + 15,
              {
                width: 740,
                align: 'center',
              },
            );

          currentY += 40;
        }

        /*
         * =================================
         * RESUMEN
         * =================================
         */

        document
          .font(
            'Helvetica-Bold',
          )
          .fontSize(9)
          .fillColor(
            '#1B1B1B',
          )
          .text(
            `Personas: ${totals.people}    Desayunos: ${totals.breakfast}    Comidas: ${totals.lunch}    Total de servicios: ${totals.total}`,
            startX,
            currentY + 14,
          );

        document.end();
      } catch (error) {
        reject(error);
      }
    },
  );
}