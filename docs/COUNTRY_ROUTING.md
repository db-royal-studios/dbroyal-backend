# Country-Based Routing Documentation

## Overview

The application supports country-based routing to provide separate experiences for Nigeria (NG) and United Kingdom (UK) users. Data is automatically filtered based on the detected country, ensuring users only see content relevant to their region.

## Supported Countries

- **Nigeria** - Country code: `NG`
- **United Kingdom** - Country code: `UK`

## How It Works

### 1. Country Detection

The `CountryGuard` automatically detects the country from incoming requests using multiple strategies (in order of precedence):

#### Strategy 1: Custom Header (Recommended)
```bash
curl -H "X-Country: NG" https://api.example.com/api/v1/events
curl -H "X-Country: UK" https://api.example.com/api/v1/events
```

#### Strategy 2: Subdomain
```
https://ng.api.example.com  → Nigeria
https://uk.api.example.com  → United Kingdom
```

#### Strategy 3: Query Parameter
```
https://api.example.com/api/v1/events?country=NG
https://api.example.com/api/v1/events?country=UK
```

**Default Behavior:** If no country is specified, the system defaults to Nigeria (`NG`).

### 2. Automatic Filtering

Once the country is detected:
- All queries automatically filter data by the detected country
- All created resources are automatically tagged with the country
- Country context is logged for monitoring and debugging

### 3. Database Schema

The following models include a `country` field:
- `User` - Users are associated with a country
- `Client` - Clients belong to a specific country
- `Event` - Events are region-specific
- `Booking` - Bookings are country-specific

All models default to `NG` (Nigeria) if not specified.

## Developer Guide

### Using Country in Controllers

Import the `@GetCountry()` decorator to access the detected country:

```typescript
import { Country } from '@prisma/client';
import { GetCountry } from '../common/decorators/country.decorator';

@Controller('events')
export class EventsController {
  @Get()
  findAll(@GetCountry() country: Country) {
    return this.eventsService.findAll(country);
  }
  
  @Post()
  create(@GetCountry() country: Country, @Body() body: CreateEventDto) {
    return this.eventsService.create({ ...body, country });
  }
}
```

### Implementing Country Filtering in Services

Update service methods to accept and filter by country:

```typescript
import { Country } from '@prisma/client';

export class EventsService {
  findAll(country?: Country) {
    return this.prisma.event.findMany({
      where: country ? { country } : undefined,
      include: { photos: true }
    });
  }
}
```

### Adding Country Support to New Models

1. Update Prisma schema:
```prisma
model NewModel {
  id      String  @id @default(cuid())
  name    String
  country Country @default(NG)
  
  @@index([country])
}
```

2. Run migration:
```bash
npx prisma migrate dev --name add_country_to_new_model
```

3. Update service and controller to use country filtering

## API Examples

### Creating Resources

Resources are automatically tagged with the detected country:

```bash
# Create a Nigeria event
curl -X POST https://api.example.com/api/v1/events \
  -H "X-Country: NG" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lagos Wedding",
    "slug": "lagos-wedding-2024",
    "category": "WEDDING"
  }'

# Create a UK event
curl -X POST https://api.example.com/api/v1/events \
  -H "X-Country: UK" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "London Corporate Event",
    "slug": "london-corp-2024",
    "category": "CORPORATE"
  }'
```

### Querying Resources

Queries automatically filter by country:

```bash
# Get Nigeria events only
curl -H "X-Country: NG" https://api.example.com/api/v1/events

# Get UK events only
curl -H "X-Country: UK" https://api.example.com/api/v1/events
```

## Testing

### Testing Country Detection

```bash
# Test with header
yarn test src/common/guards/country.guard.spec.ts

# Test end-to-end
curl -v -H "X-Country: INVALID" https://api.example.com/api/v1/events
# Should return 400 Bad Request with error message
```

### Testing in Development

Set the country header in your API client (Postman, Insomnia, etc.):
- Header: `X-Country`
- Value: `NG` or `UK`

## Monitoring

Country context is automatically logged for each request:

```
[NG] GET /api/v1/events
[UK] POST /api/v1/bookings
[NG] Request completed: GET /api/v1/events
```

This helps with:
- Debugging country-specific issues
- Monitoring usage by region
- Auditing data access patterns

## Migration Guide

To add country support to existing data:

```sql
-- Update existing records to default country (Nigeria)
UPDATE "Event" SET country = 'NG' WHERE country IS NULL;
UPDATE "Booking" SET country = 'NG' WHERE country IS NULL;
UPDATE "Client" SET country = 'NG' WHERE country IS NULL;
UPDATE "User" SET country = 'NG' WHERE country IS NULL;
```

Then run:
```bash
npx prisma migrate dev --name add_country_support
npx prisma generate
```

## Best Practices

1. **Always use the X-Country header** in production for explicit country routing
2. **Test both countries** when developing new features
3. **Index country fields** in database for query performance
4. **Log country context** for debugging and analytics
5. **Default to NG** to maintain backward compatibility
6. **Validate country codes** at the API boundary (handled by CountryGuard)

## Troubleshooting

### Country not detected
- Verify the header name is exactly `X-Country` (case-insensitive)
- Check that the country code is uppercase (`NG`, `UK`)
- Ensure the guard is registered globally in AppModule

### Wrong data returned
- Check database records have correct country values
- Verify service methods include country filtering
- Check logs to confirm detected country

### Migration errors
- Ensure Prisma schema is updated before running migrations
- Run `npx prisma generate` after schema changes
- Check that country enum values match between TypeScript and Prisma
