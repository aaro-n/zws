import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';
import { ExceptionSchema } from '../../_lib/exceptions/dtos/exception.dto';
import { UrlStatsSchema } from '../../_lib/url-stats/dtos/url-stats.dto';
import { urlStatsService } from '../../_lib/url-stats/url-stats.service';
import { ShortSchema } from '../../_lib/urls/dtos/short.dto';
import { UrlNotFoundException } from '../../_lib/urls/exceptions/url-not-found.exception';
import { validateParams } from '../../_lib/util/validate-request';
import { Short } from '../../_lib/urls/interfaces/urls.interface';

export async function GET(
	request: NextRequest,
	context: { params: { short: string } },
): Promise<NextResponse<UrlStatsSchema | ExceptionSchema>> {
	const params = validateParams(context, z.object({ short: ShortSchema }));
	if (params instanceof NextResponse) {
		return params;
	}

	const short = decodeURIComponent(params.short) as Short;

	const stats = await urlStatsService.statsForUrl(short);

	if (!stats) {
		return new UrlNotFoundException().toResponse();
	}

	return NextResponse.json(stats);
}